#!/usr/bin/env node

import { genDiff } from './files.js'
import { Command } from 'commander';
const program = new Command();

program
  .version('0.0.1')
  .description('Usage: gendiff [options] <filepath1> <filepath2>' +
      '\n\nCompares two configuration files and shows a difference.')
  .option('-f, --format <type>', 'output format')
  .parse(process.argv);

const { args } = program;
const options = program.opts();
if (options.format) {
} else {
  genDiff(args[0], args[1]);
}

