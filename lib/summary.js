#!/usr/bin/env node

const { Command } = require('commander');
const LexRank = require('lexrank');

const program = new Command();

program
  .name('summary')
  .description('Summarize git commit messages')
  .option('-w, --words <number>', 'maximum number of words in summary', '200')
  .action((options) => {
    const wordLimit = parseInt(options.words);
    
    // Read from stdin
    let input = '';
    process.stdin.setEncoding('utf8');
    
    process.stdin.on('data', (chunk) => {
      input += chunk;
    });
    
    process.stdin.on('end', () => {
      if (!input || input.trim() === '') {
        console.log('No commit messages');
        return;
      }

      // Clean up commit messages - remove duplicates and empty lines
      const messages = input
        .split('\n')
        .map(msg => msg.trim())
        .filter(msg => msg.length > 0)
        .filter((msg, index, arr) => arr.indexOf(msg) === index);

      if (messages.length === 0) {
        console.log('No valid commit messages');
        return;
      }

      if (messages.length === 1) {
        // If only one message, just truncate to word limit
        const words = messages[0].split(' ').slice(0, wordLimit);
        console.log(words.join(' '));
        return;
      }

      try {
        // Use LexRank to summarize
        const lexrank = new LexRank(messages);
        const summary = lexrank.summarize(Math.min(3, messages.length)); // Get top 3 sentences or fewer
        
        // Join summary sentences and limit to word count
        const summaryText = summary.join(' ');
        const words = summaryText.split(' ').slice(0, wordLimit);
        console.log(words.join(' '));
      } catch (err) {
        // Fallback to simple concatenation if LexRank fails
        const fallback = messages.slice(0, 3).join('; ');
        const words = fallback.split(' ').slice(0, wordLimit);
        console.log(words.join(' '));
      }
    });
  });

program.parse();