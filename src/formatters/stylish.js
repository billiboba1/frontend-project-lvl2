import _ from 'lodash';
import {
  returnIncludingFiles, returnStylishObject, combineAndSortFiles, sortFile,
} from '../functions.js';

const returnStylishString = (file1, file2) => {
  let resultString = '{\n';

  const generateResultString = (combinedFiles, file1, file2, space = 1, currentPath = '') => {
    let internalString;
    const needingSpace = ('  '.repeat(space));
    Object.keys(combinedFiles).forEach((key) => {
      internalString = '';
      if (_.isPlainObject(combinedFiles[key])) {
        if (returnIncludingFiles(file1, file2, key, {}, currentPath) !== '  ') {
          // only one file includes this obj
          const difference = returnIncludingFiles(file1, file2, key, {}, currentPath);
          internalString += returnStylishObject(key, combinedFiles[key], space, difference);
          resultString += internalString;
        } else {
          resultString += `${needingSpace}  ${key}: {\n`;
          generateResultString(combinedFiles[key], file1, file2, space + 2, `${currentPath}/${key}`);
          resultString += `${needingSpace}  }${internalString}\n`;
        }
      } else if (Array.isArray(combinedFiles[key])) {
        // for same keys
        if (_.isPlainObject(combinedFiles[key][0])) {
          internalString += returnStylishObject(key, combinedFiles[key][0], space, '- ');
        } else {
          internalString += `${returnStylishObject(key, combinedFiles[key][0], space, '- ')}\n`;
        }
        if (_.isPlainObject(combinedFiles[key][1])) {
          internalString += returnStylishObject(key, combinedFiles[key][1], space, '+ ');
        } else {
          internalString += `${returnStylishObject(key, combinedFiles[key][1], space, '+ ')}\n`;
        }
        resultString += internalString;
      } else {
        internalString += needingSpace;
        internalString += returnIncludingFiles(file1, file2, key, combinedFiles[key], currentPath);
        internalString += `${key}: ${combinedFiles[key]}`;
        resultString += `${internalString}\n`;
      }
    });
  };

  const combinedFiles = sortFile(combineAndSortFiles(file1, file2));
  generateResultString(combinedFiles, file1, file2);
  resultString += '}';
  return resultString;
};

export default returnStylishString;
