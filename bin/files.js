import * as fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parseFile from './parsers.js';
import returnStylishString from '../src/formatters/stylish.js';
import returnPlainString from '../src/formatters/plain.js';
import returnJsonString from '../src/formatters/json.js';

const generateDifference = (file1, file2, format) => {
  if (format === 'stylish') {
    const string = returnStylishString(file1, file2);
    console.log(string);
    return string;
  } if (format === 'plain') {
    const string = returnPlainString(file1, file2);
    console.log(string);
    return string;
  } if (format === 'json') {
    const string = returnJsonString(file1, file2);
    console.log(string);
    return string;
  }
  return true;
};

const genDiff = (filepathes, format = 'stylish') => {
  const path1 = path.resolve(filepathes[0]);
  const path2 = path.resolve(filepathes[1]);
  const extension1 = _.last(path1.split('.'));
  const extension2 = _.last(path2.split('.'));
  try {
    const file1 = fs.readFileSync(path1, 'utf8');
    const file2 = fs.readFileSync(path2, 'utf8');
    return generateDifference(parseFile(file1, extension1), parseFile(file2, extension2), format);
  } catch (e) {
    console.log(path1, '\n', path2);
  }
};

export default genDiff;