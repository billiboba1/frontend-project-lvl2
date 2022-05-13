#!/usr/bin/env node

import { Command } from 'commander';
const program = new Command();

program
  .version('0.0.1')
  .description('Usage: gendiff [options] <filepath1> <filepath2>' +
      '\n\nCompares two configuration files and shows a difference.')
  .option('-f, --format <type>', 'output format');

program.parse();