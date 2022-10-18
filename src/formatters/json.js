import _ from 'lodash';
import {
  returnIncludingFiles, combineAndSortFiles, sortFile, getValueInside, addValueInside,
} from '../functions.js';

const returnJsonString = (firstFile, secondFile) => {
  const resultObject = {};
  const generateResultString = (combinedFiles, file1, file2, currentPath = '') => {
    Object.keys(combinedFiles).forEach((key) => {
      const newPath = `${currentPath}/${key}`;
      if (_.isPlainObject(combinedFiles[key])) {
        if (returnIncludingFiles(file1, file2, key, {}, currentPath) === '+ ') {
          // only one file includes this obj
          const part = getValueInside(newPath, {}, combinedFiles[key]);
          addValueInside(resultObject, part);
        } else {
          generateResultString(combinedFiles[key], file1, file2, `${currentPath}/${key}`);
        }
      } else if (Array.isArray(combinedFiles[key])) {
        const part = getValueInside(newPath, {}, combinedFiles[key][1]);
        addValueInside(resultObject, part);
      } else {
        const difference = returnIncludingFiles(file1, file2, key, combinedFiles[key], currentPath);
        if (difference === '+ ') {
          const part = getValueInside(newPath, {}, combinedFiles[key]);
          addValueInside(resultObject, part);
        }
      }
    });
  };

  const combinedFiles = sortFile(combineAndSortFiles(firstFile, secondFile));
  generateResultString(combinedFiles, firstFile, secondFile);
  return JSON.stringify(resultObject, null, 2);
};

export default returnJsonString;