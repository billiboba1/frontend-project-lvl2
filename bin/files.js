import * as fs from 'fs';
import _ from 'lodash';
import path from 'path';
import process from 'process';

const sortFn = (x, y) => {
  if (x[0] > y[0]) {
    return 1;
  } else if(x[0] < y[0]) {
    return -1;
  } 
  return 0;
}

export const genDiff = (filepath1, filepath2) => {

  const generateDifference = (file1, file2) => {
    const resultString = '{/n  ';
    const obj = {};
    const generateResultList = (child) => {
      console.log(child);
      obj[child[0]] = child[1];
      console.log(child+1);
    }
    file1 = JSON.parse(file1);
    file2 = JSON.parse(file2);
    const array1 = Object.entries(file1);
    const array2 = Object.entries(file2);
    const overallArray = [...array1, ...array2];
    overallArray.sort(sortFn);
    const overallObj = overallArray.map(generateResultList);
    console.log(obj);
    //console.log(overallArray);
    console.log(JSON.stringify(obj));
    return 1;
  }

  const path1 = path.resolve(filepath1);
  const path2 = path.resolve(filepath2);
  const file1 = fs.readFileSync(path1, "utf8");
  const file2 = fs.readFileSync(path2, "utf8");

  return generateDifference(file1, file2);
};