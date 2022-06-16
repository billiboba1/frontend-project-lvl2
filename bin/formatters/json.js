import _ from 'lodash';
import {
  returnIncludingFiles, combineAndSortFiles, sortFile, getValueInside, addValueInside
} from '../functions.js';

const returnJsonString = (file1, file2) => {
  const resultObject = {};
  const generateResultString = (combinedFiles, file1, file2, currentPath = '') => {
    for (const key in combinedFiles) {
      const newPath = currentPath + '/' + key;
      if (_.isPlainObject(combinedFiles[key])) {
        if (returnIncludingFiles(file1, file2, key, {}, currentPath) === '+ ') {
          //only one file includes this obj
          const part = getValueInside(newPath, {}, combinedFiles[key]);
          console.log(part);
          addValueInside(resultObject, part);
          //console.log(resultObject);
        } else {
          generateResultString(combinedFiles[key], file1, file2, currentPath + `/${key}`);
        }
      } else {
        if (Array.isArray(combinedFiles[key])) {
          const part = getValueInside(newPath, {}, combinedFiles[key][1]);
          console.log(part);
          addValueInside(resultObject, part);
          //console.log(resultObject);
        } else {
          const difference = returnIncludingFiles(file1, file2, key, combinedFiles[key], currentPath);
          if (difference === '+ ') {
            const part = getValueInside(newPath, {}, combinedFiles[key]);
            console.log(part);
            addValueInside(resultObject, part);
            //console.log(resultObject);
          }
        }
      }
    }
  };

  const combinedFiles = sortFile(combineAndSortFiles(file1, file2));
  generateResultString(combinedFiles, file1, file2);
  return JSON.stringify(resultObject, null, 2);
};

export default returnJsonString;
