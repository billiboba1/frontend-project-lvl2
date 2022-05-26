#!/usr/bin/env node

import { Command } from 'commander';
import { genDiff } from './files.js';

const program = new Command();

program
  .version('0.0.1')
  .description('Usage: gendiff [options] <filepath1> <filepath2>'
      + '\n\nCompares two configuration files and shows a difference.')
  .option('-f, --format <type>', 'output format')
  .arguments('<files...>')
  .action(genDiff)
  .parse(process.argv);

const { args } = program;
const options = program.opts();
if (options.format) {

}
