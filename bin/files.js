import * as fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parseFile from './parsers.js';
import { findElement, returnIncludingFiles, returnSameStylishFiles, returnStylishObject,
   combineAndSortFiles , sortFile, sortFn} from './functions.js';


const generateDifference = (file1, file2, format) => {
  let stylishString = '{\n';
  const generateStylishString = (combinedFiles, file1,  file2, space = 1, currentPath = '') => {
    let internalString;
    const needingSpace = ('  '.repeat(space));
    const endingScopes = ('  '.repeat(space - 1)) + '}';
    for (const key in combinedFiles) {
      internalString = '';
      if (_.isPlainObject(combinedFiles[key])) {
        if (returnIncludingFiles(file1, file2, key, {}, currentPath) != '  ') {
          //only one file includes this obj
          const difference = returnIncludingFiles(file1, file2, key, {}, currentPath);
          internalString += returnStylishObject(key, combinedFiles[key], space, difference);
          stylishString += internalString
        } else {
          stylishString += `${needingSpace}  ${key}: {\n`;
          generateStylishString(combinedFiles[key], file1, file2, space + 2, currentPath + `/${key}`);
          stylishString += needingSpace + '  }';
          stylishString += internalString + '\n';
        }
      } else {
        if (Array.isArray(combinedFiles[key])) {
          //for same keys
          internalString += returnSameStylishFiles(key, combinedFiles[key][0], space, '- ') + '\n';
          internalString += returnSameStylishFiles(key, combinedFiles[key][1], space, '+ ');
        } else {
          internalString += needingSpace;
          internalString += returnIncludingFiles(file1, file2, key, combinedFiles[key], currentPath);
          internalString += `${key}: ${combinedFiles[key]}`;
        }
        stylishString += internalString + '\n';
      }
    }
  };

  const combinedFiles = sortFile(combineAndSortFiles(file1, file2));
  generateStylishString(combinedFiles, file1, file2);
  stylishString += '}';
  console.log(stylishString);
  return stylishString;
};

export const genDiff = (filepathes, format = 'stylish') => {
  const path1 = path.resolve(filepathes[0]);
  const path2 = path.resolve(filepathes[1]);
  const extension1 = _.last(path1.split('.'));
  const extension2 = _.last(path2.split('.'));
  const file1 = fs.readFileSync(path1, 'utf8');
  const file2 = fs.readFileSync(path2, 'utf8');
  return generateDifference(parseFile(file1, extension1), parseFile(file2, extension2), format);
};