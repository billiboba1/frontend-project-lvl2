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

const generateDifference = (file1, file2, format, space = 1) => {
  let stylishString = '{\n';
  const generateStylishString = (file, file2, status, space) => {
    switch (status) {
      case 0:

      case 1:
      
    }
  };

  console.log(file1, '\n', file2, '\n\n\n');

  const combineAllParts = (file1, file2) => {
    const file = _.cloneDeep(file1);
    for (const key in file2) {
      if (!(key in file1)) {
        file[key] = file2[key];
      } else if (_.isPlainObject(file1[key]) && _.isPlainObject(file2[key])) {
        file[key] = combineAllParts(file[key], file2[key]);
      } else if (file1[key] != file2[key]) {
        file[key] = [file1[key], file2[key]];
      }
    }
    console.log('\n\n\n\n');
    return file;
  }

  console.log(combineAllParts(file1, file2));

  const findElement = (file, obj) => {
    for (const key in file) {
      if (obj[key] === file[key] && !!file[key]) {
        console.log('ldflk;gd;');
        return true;
      }
      if (_.isPlainObject(file[key])) {
        if ((findElement(file[key], obj)) != undefined) {
          return true;
        }
      }
    }  
  };
  console.log(findElement(file1, {'fee': 100500}));
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
