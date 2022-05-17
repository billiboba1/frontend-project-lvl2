import * as fs from 'fs';
import _ from 'lodash';
import path from 'path';
import process from 'process';

const sortFn = (x, y) => {
  if (x[0] > y[0]) {
    return 1;
  } else if (x[0] < y[0]) {
    return -1;
  }
  return 0;
}

export const genDiff = (filepath1, filepath2) => {

  const generateDifference = (file1, file2) => {
    let resultString = '{\n';
    const obj = {};
    const generateResultList = (child) => {
      console.log(child);
      console.log(deleteList[deleteList.length - 1]);
      if ((deleteList.length > 0) && (deleteList[deleteList.length - 1][0] === child[0]) && (deleteList[deleteList.length - 1][1] === child[1])) {
        deleteList.pop();
        resultString += `  ${child[0]}: ${child[1]}\n`;
      } else {
        if (array1.includes(child) && !array2.includes(child)) {
          resultString += `  - ${child[0]}: ${child[1]}\n`;
        } else if (!array1.includes(child) && array2.includes(child)) {
          resultString += `  + ${child[0]}: ${child[1]}\n`;
        }
      }
    }
    file1 = JSON.parse(file1);
    file2 = JSON.parse(file2);
    const array1 = Object.entries(file1);
    const array2 = Object.entries(file2);
    console.log(array1, array2);
    const overallArray = [...array1, ...array2];
    overallArray.sort(sortFn);
    const newArray = [];
    const deleteList = [];
    for (let i = 0; i < overallArray.length - 1; i += 1) {
      if (!((overallArray[i][0] === overallArray[i + 1][0]) && (overallArray[i][1] === overallArray[i + 1][1]))) {
        newArray.push(overallArray[i]);
      } else {
        deleteList.splice(0, 0, overallArray[i]);
      }
    }
    console.log(deleteList);
    newArray.push(overallArray[overallArray.length - 1]);
    console.log(newArray);
    newArray.map(generateResultList);
    return resultString + '}';
  }

  const path1 = path.resolve(filepath1);
  const path2 = path.resolve(filepath2);
  const file1 = fs.readFileSync(path1, "utf8");
  const file2 = fs.readFileSync(path2, "utf8");

  return generateDifference(file1, file2);
};