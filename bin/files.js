import * as fs from 'fs';
import _ from 'lodash';

export const fileDif = (filepath1, filepath2) => {
  const generateDifference = (file1, file2) => {
    const array1 = Object.entries(file1);
    console.log(array1);
  }
  const file1 = fs.readFileSync(filepath1, "utf8");
  const file2 = fs.readFileSync(filepath2, "utf8");
  
  return generateDifference(file1, file2);
}