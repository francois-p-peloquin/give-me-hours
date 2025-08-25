#!/usr/bin/env node

const { Command } = require('commander');
const SummaryTool = require('node-summary');

const program = new Command();

program
  .name('summary')
  .description('Summarize git commit messages')
  .option('-w, --words <number>', 'maximum number of words in summary', '200')
  .argument('<messages>', 'commit messages to summarize (newline separated)')
  .action((messages, options) => {
    const wordLimit = parseInt(options.words);
    
    if (!messages || messages.trim() === '') {
      console.error('No commit messages provided');
      process.exit(1);
    }

    // Clean up commit messages - remove duplicates and empty lines
    const cleanMessages = messages
      .split('\n')
      .map(msg => msg.trim())
      .filter(msg => msg.length > 0)
      .filter((msg, index, arr) => arr.indexOf(msg) === index)
      .join('. ');

    if (cleanMessages.length === 0) {
      console.error('No valid commit messages found');
      process.exit(1);
    }

    // Use node-summary to create summary
    SummaryTool.summarize('', cleanMessages, (err, summary) => {
      if (err) {
        console.error('Error creating summary:', err.message);
        process.exit(1);
      }

      // Limit to specified word count
      const words = summary.split(' ');
      const limitedSummary = words.slice(0, wordLimit).join(' ');
      
      console.log(limitedSummary);
    });
  });

program.parse();