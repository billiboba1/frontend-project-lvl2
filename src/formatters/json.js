import _ from 'lodash';
import {
  returnIncludingFiles, combineAndSortFiles, sortFile, getValueInside, forJsonOutput,
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
          console.log(key);
          console.log(returnIncludingFiles(file1, file2, key, {}, currentPath));
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
    //console.log(result.join(''));
    const needingValues = result.filter((child) => child !== undefined)
      .flat();
    console.log(needingValues);
    return needingValues;
  };

  const combinedFiles = sortFile(combineAndSortFiles(firstFile, secondFile));
  const finalObject = generateResultString(combinedFiles, firstFile, secondFile);
  return JSON.stringify(finalObject, null, 2);
};

export default returnJsonString;
