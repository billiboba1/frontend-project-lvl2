import _ from 'lodash';
import {
  returnIncludingFiles, combineAndSortFiles, sortFile, putValueInside
} from '../functions.js';

const returnJsonString = (file1, file2) => {
  const resultObject = {};
  const generateResultString = (combinedFiles, file1, file2, internalObject = {}, currentPath = '') => {
    for (const key in combinedFiles) {
      const newPath = currentPath + '/' + key;
      if (_.isPlainObject(combinedFiles[key])) {
        if (returnIncludingFiles(file1, file2, key, {}, currentPath) != '  ') {
          //only one file includes this obj
          const difference = returnIncludingFiles(file1, file2, key, {}, currentPath);
          if (difference === '+ ') {
            const part = putValueInside(newPath, resultObject, combinedFiles[key]);
            Object.assign(internalObject, part);
          }
        } else {
          generateResultString(combinedFiles[key], file1, file2, internalObject[key], currentPath + `/${key}`);
        }
      } else {
        if (Array.isArray(combinedFiles[key])) {
          const part = putValueInside(newPath, resultObject, combinedFiles[key][1]);
          Object.assign(internalObject, part);
        } else {
          const difference = returnIncludingFiles(file1, file2, key, combinedFiles[key], currentPath);
          if (difference === '+ ') {
            const part = putValueInside(newPath, resultObject, combinedFiles[key]);
            Object.assign(internalObject, part);
          }
        }
      }
      console.log(internalObject);
    }
  };

  const combinedFiles = sortFile(combineAndSortFiles(file1, file2));
  generateResultString(combinedFiles, file1, file2);
  return resultObject;
};

export default returnJsonString;
