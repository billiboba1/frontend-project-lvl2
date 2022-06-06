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
    if (value === file[key] && requiredPath === currentPath && key === name) {
      return true;
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
  console.log('\n\n\n\n');
  return file;
};

const returnStylishString = (file1, file2, requiredPath) => {
  if (findElement(file1, key, file1[key], requiredPath)) {
    if (findElement(file2, key, file1[key], requiredPath)) {
      return 'both';
      //both files includes
    } else {
      return 'second';
      //only second file includes
    }
  } else {
    return 'first';
    //only first file includes
  }
};

const generateDifference = (file1, file2, format) => {
  console.log(findElement(file2, "follow", false, '/common'));
  console.log(file1, file2);
  let stylishString = '{\n';

  const generateStylishString = (combinedFiles, file1,  file2, space = 1, currentPath = '') => {
    let internalString;
    for (const key in combinedFiles) {
      internalString = '';
      if (_.isPlainObject(combinedFiles[key])) {
        internalString += generateStylishString(combinedFiles, file1, file2, space + 2, currentPath + `/${key}`);
        //add current path
      } else {
        internalString += returnStylishString(file1, file2, currentPath);
      }
    }
    stylishString += internalString
  };

  const combinedFiles = sortFile(combineAndSortFiles(file1, file2));
  stylishString += generateStylishString(combinedFiles, file1, file2);
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
