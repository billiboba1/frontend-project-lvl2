import _ from 'lodash';
import {
  returnIncludingFiles, combineAndSortFiles, sortFile, getValueInside,
} from '../functions.js';

const returnJsonString = (firstFile, secondFile) => {
  const generateResultString = (combinedFiles, file1, file2, currentPath = '') => {
    const result = Object.keys(combinedFiles).map((key) => {
      const newPath = `${currentPath}/${key}`;
      if (_.isPlainObject(combinedFiles[key])) {
        if (returnIncludingFiles(file1, file2, key, {}, currentPath) === '+ ') {
          // needing file includes this obj
          //console.log(getValueInside(newPath, combinedFiles[key]));
          return { [key]: getValueInside(newPath, combinedFiles[key]) };
        } else if (returnIncludingFiles(file1, file2, key, {}, currentPath) === '  ') {
          return { [key]: generateResultString(combinedFiles[key], file1, file2, `${currentPath}/${key}`) };
        }
      } else if (Array.isArray(combinedFiles[key])) {
        //console.log(getValueInside(newPath, combinedFiles[key][1]));
        return { [key]: getValueInside(newPath, combinedFiles[key][1]) };
      } else {
        const difference = returnIncludingFiles(file1, file2, key, combinedFiles[key], currentPath);
        if (difference === '+ ') {
          //console.log(getValueInside(newPath, combinedFiles[key]));
          return { [key]: getValueInside(newPath, combinedFiles[key]) };
        }
      }
    });
    const needingValues = result.filter((child) => child !== undefined);
    return needingValues;
  };

  const combinedFiles = sortFile(combineAndSortFiles(firstFile, secondFile));
  const finalArray = generateResultString(combinedFiles, firstFile, secondFile);
  const finalObject = JSON.stringify(finalArray)
    .substring(1, JSON.stringify(finalArray).length - 1)
    .replace(/},{/g, ',')
    .replace(/\[/g, '')
    .replace(/\]/g, '');
  return JSON.stringify(JSON.parse(finalObject), null, 2);
};

export default returnJsonString;
