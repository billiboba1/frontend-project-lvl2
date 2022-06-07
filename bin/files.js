import * as fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parseFile from './parsers.js';

const sortFn = (x, y) => {
  if (x > y) {
    return 1;
  } if (x < y) {
    return -1;
  }
  return 0;
};

const sortFile = (file) => {
  const newArray = Object.keys(file);
  return newArray.sort(sortFn).reduce(
    (acc, key) => {
      acc[key] = file[key];
      return acc;
    }, {}
  );
};

const findElement = (file, name, value, requiredPath, currentPath = '') => {
  for (const key in file) {
    if (_.isPlainObject(value) && key === name && requiredPath === currentPath) {
      return true;
      //finding object or not
    }
    if (value === file[key] && requiredPath === currentPath && key === name) {
      return true;
      //found a file
    }
    if (_.isPlainObject(file[key])) {
      if (findElement(file[key], name, value, requiredPath, currentPath + `/${key}`) != undefined) {
        return true;
      }
    }
  }  
};

const combineAndSortFiles = (file1, file2) => {
  const file = _.cloneDeep(file1);
  for (const key in file2) {
    if (!(key in file1)) {
      file[key] = file2[key];
    } else if (_.isPlainObject(file1[key]) && _.isPlainObject(file2[key])) {
      file[key] = sortFile(combineAndSortFiles(file[key], file2[key]));
    } else if (file1[key] != file2[key]) {
      file[key] = [file1[key], file2[key]];
    }
  }
  console.log('\n');
  return file;
};

const returnIncludingFiles = (file1, file2, key, value, requiredPath) => {
  //return files, which includes chosen part of the file
  if (findElement(file1, key, value, requiredPath)) {
    if (findElement(file2, key, value, requiredPath)) {
      return ('  ');
      //both files includes
    } else {
      return ('- ');
      //only second file includes
    }
  } else {
    return ('+ ');
    //only first file includes
  }
};

const returnStylishObject = (key, value, space, difference = '  ') => {
  const needingSpace = ('  '.repeat(space));
  let returnString = needingSpace + difference + key + ': ';
  if (_.isPlainObject(value)) {
    returnString += '{\n';
    for (const internalKey in value) {
      if (_.isPlainObject(value[internalKey])) {
        returnString += returnStylishObject(internalKey, value[internalKey], space + 2);
      } else {
        returnString += `${needingSpace}      ${internalKey}: ${value[internalKey]}\n`;
      }
    }
    returnString += needingSpace + '  }';
  } 
  returnString += '\n'; 
  return returnString;
};

const generateDifference = (file1, file2, format) => {
  console.log(file1, file2);
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
          //console.log(key, combinedFiles[key], currentPath);
          const difference = returnIncludingFiles(file1, file2, key, {}, currentPath);
          internalString += returnStylishObject(key, combinedFiles[key], space, difference);
        } else {
          stylishString += `${key}: {\n`;
          generateStylishString(combinedFiles[key], file1, file2, space + 2, currentPath + `/${key}`);
        }
      } else {
        if (Array.isArray(combinedFiles[key])) {
          //for same keys
          internalString += needingSpace + `- ${key}: ${combinedFiles[key][0]}\n`;
          internalString += needingSpace + `+ ${key}: ${combinedFiles[key][1]}`;
        } else {
          internalString += needingSpace;
          internalString += returnIncludingFiles(file1, file2, key, combinedFiles[key], currentPath);
          internalString += `${key}: ${combinedFiles[key]}`;
        }
      }
      if (_.isPlainObject(combinedFiles[key])) {
        internalString + endingScopes;
      }
      //console.log(internalString);
      stylishString += internalString + '\n';
    }
  };

  const combinedFiles = sortFile(combineAndSortFiles(file1, file2));
  generateStylishString(combinedFiles, file1, file2);
  console.log(stylishString);
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
