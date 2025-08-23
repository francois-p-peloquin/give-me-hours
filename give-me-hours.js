#!/usr/bin/env node

const { execSync } = require('child_process');
const { program } = require('commander');

class GitHours {
  constructor() {
    this.options = {
      author: null,
      since: this.getDefaultSinceDate(),
      before: this.getDefaultBeforeDate(),
      duration: 3600, // 1 hour in seconds
      debug: false
    };
    
    this.parseArguments();
  }

  parseArguments() {
    program
      .name('git-hours')
      .description('Calculate working hours using git commits')
      .option('-a, --author <author>', 'Author name (comma-separated for multiple)')
      .option('-s, --since <date>', 'Since (after) date', this.options.since)
      .option('-b, --before <date>', 'Before date', this.options.before)
      .option('-d, --duration <duration>', 'Git log duration (default: 1h)', '1h')
      .option('--debug', 'Debug mode', false)
      .helpOption('-h, --help', 'Print help')
      .parse();

    const opts = program.opts();
    this.options.author = opts.author;
    this.options.since = opts.since;
    this.options.before = opts.before;
    this.options.duration = this.parseDuration(opts.duration);
    this.options.debug = opts.debug;
  }

  run() {
    try {
      const commits = this.getGitCommits();
      
      if (commits.length === 0) {
        console.log('No commits found in the specified date range');
        return;
      }

      const totalSeconds = this.calculateWorkingHours(commits);
      console.log(`From "${this.options.since}" to "${this.options.before}" : ${this.formatDuration(totalSeconds)}`);
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  getDefaultSinceDate() {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const timezone = this.getTimezoneOffset();
    return `${lastMonth.toISOString().split('T')[0]} 00:00:00 ${timezone}`;
  }

  getDefaultBeforeDate() {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const timezone = this.getTimezoneOffset();
    return `${lastMonth.toISOString().split('T')[0]} 23:59:59 ${timezone}`;
  }

  getTimezoneOffset() {
    const offset = new Date().getTimezoneOffset();
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const sign = offset <= 0 ? '+' : '-';
    return `${sign}${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}`;
  }

  parseDuration(durationStr) {
    const match = durationStr.toLowerCase().match(/(\d+(?:\.\d+)?)([hms])/);
    if (!match) {
      return parseFloat(durationStr) * 3600; // assume hours if no unit
    }

    const value = parseFloat(match[1]);
    const unit = match[2];

    switch (unit) {
      case 'h': return value * 3600;
      case 'm': return value * 60;
      case 's': return value;
      default: return value * 3600;
    }
  }

  getGitCommits() {
    const cmd = this.buildGitCommand();
    
    try {
      const output = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
      return this.parseGitOutput(output);
    } catch (error) {
      if (error.status !== 0) {
        throw new Error(`Git command failed: ${cmd}`);
      }
      throw error;
    }
  }

  buildGitCommand() {
    let cmd = 'git log --pretty=format:"%ai|%an|%s" --reverse';
    
    if (this.options.since && this.options.before) {
      // Handle "today" keyword
      const beforeDate = this.options.before === 'today' ? 
        new Date().toISOString().replace('T', ' ').slice(0, 19) + ' ' + this.getTimezoneOffset() : 
        this.options.before;
      cmd += ` --since="${this.options.since}" --before="${beforeDate}"`;
    }
    
    if (this.options.author) {
      const authors = this.options.author.split(',').map(a => a.trim());
      const authorConditions = authors.map(author => `--author="${author}"`).join(' ');
      cmd += ` ${authorConditions}`;
    }
    
    return cmd;
  }

  parseGitOutput(output) {
    const commits = [];
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      const parts = line.split('|');
      if (parts.length < 3) continue;
      
      try {
        const timestamp = new Date(parts[0]);
        const author = parts[1];
        const message = parts.slice(2).join('|'); // rejoin in case message contains |
        
        commits.push({
          timestamp,
          author,
          message
        });
      } catch (error) {
        if (this.options.debug) {
          console.log(`Error parsing commit: ${line}`);
        }
      }
    }
    
    return commits.sort((a, b) => a.timestamp - b.timestamp);
  }

  calculateWorkingHours(commits) {
    if (commits.length < 2) return 0;
    
    let totalSeconds = 0;
    
    for (let i = 1; i < commits.length; i++) {
      const currentCommit = commits[i];
      const previousCommit = commits[i - 1];
      
      const interval = Math.floor((currentCommit.timestamp - previousCommit.timestamp) / 1000);
      
      if (this.options.debug) {
        const timeStr = previousCommit.timestamp.toISOString().replace('T', ' ').slice(0, 19) + ' ' + this.getTimezoneOffset();
        console.log(`${timeStr} ${previousCommit.author} ${previousCommit.message}`);
        console.log(`${this.formatDuration(interval)} >`);
      }
      
      // Only count time if interval is less than the duration threshold
      if (interval <= this.options.duration) {
        totalSeconds += interval;
      }
    }
    
    // Print the last commit in debug mode
    if (this.options.debug && commits.length > 0) {
      const lastCommit = commits[commits.length - 1];
      const timeStr = lastCommit.timestamp.toISOString().replace('T', ' ').slice(0, 19) + ' ' + this.getTimezoneOffset();
      console.log(`${timeStr} ${lastCommit.author} ${lastCommit.message}`);
    }
    
    return totalSeconds;
  }

  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    const result = [];
    if (hours > 0) result.push(`${hours}h`);
    if (minutes > 0) result.push(`${minutes}m`);
    if (secs > 0 || result.length === 0) result.push(`${secs}s`);
    
    return result.join('');
  }
}

// Package.json check and installation guide
function checkDependencies() {
  try {
    require('commander');
  } catch (error) {
    console.error('Missing dependency: commander');
    console.error('Please install it with: npm install commander');
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  checkDependencies();
  const gitHours = new GitHours();
  gitHours.run();
}

module.exports = GitHours;