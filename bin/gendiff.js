#!/usr/bin/env node

import { Command } from 'commander';
import genDiff from './files.js';

const program = new Command();

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format <type>', 'output format')
  .arguments('<filepath1, filepath2')
  .parse(process.argv);

const { args } = program;
const options = program.opts();

program
  .action(genDiff(args, options.format));
