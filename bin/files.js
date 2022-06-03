import * as fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parseFile from './parsers.js';

const sortFn = (x, y) => {
  if (x[0] > y[0]) {
    return 1;
  } if (x[0] < y[0]) {
    return -1;
  }
  return 0;
};

const forEmpty = (file) => {
  if (JSON.stringify(file) != '{}') {
    return Object.entries(file);
  }
  return [];
};

const generateDifference = (file1, file2, format, space = 1) => {
  let stylishString = '{\n';
  const generateStylishString = (child, deleteList, space) => {
    if ((deleteList.length > 0) && (deleteList[deleteList.length - 1][0] === child[0]) && (deleteList[deleteList.length - 1][1] === child[1])) {
      deleteList.pop();
      stylishString += `${'  '.repeat(space)}  ${child[0]}: ${child[1]}\n`;
    } else if (array1.includes(child) && !array2.includes(child)) {
      stylishString += `${'  '.repeat(space)}- ${child[0]}: ${child[1]}\n`;
    } else if (!array1.includes(child) && array2.includes(child)) {
      stylishString += `${'  '.repeat(space)}+ ${child[0]}: ${child[1]}\n`;
    }
  };
  const array1 = Object.entries(file1);
  const array2 = forEmpty(file2);
  const overallArray = [...array1, ...array2];
  overallArray.sort(sortFn);
  overallArray.map((child) => {
    if (_.isPlainObject(child[1])) {
      child[1] = generateDifference(child[1], {}, format, space + 2);
      return generateDifference(child[1], {}, format, space + 2);
    }
  })
  console.log(overallArray);
  const newArray = [];
  const deleteList = [];
  for (let i = 0; i < overallArray.length - 1; i += 1) {
    if (!((overallArray[i][0] === overallArray[i + 1][0]) && (overallArray[i][1] === overallArray[i + 1][1]))) {
      newArray.push(overallArray[i]);
    } else {
      deleteList.splice(0, 0, overallArray[i]);
    }
  }
  newArray.push(overallArray[overallArray.length - 1]);
  if (format === 'stylish') {
    newArray.map((child) => generateStylishString(child, deleteList, space));
    console.log(`${stylishString}}`);
    return `${stylishString}}`;
  }
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
