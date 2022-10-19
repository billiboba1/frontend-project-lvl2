import _ from 'lodash';
import {
  returnIncludingFiles, returnStylishObject, combineAndSortFiles, sortFile,
} from '../functions.js';

const returnStylishString = (file1, file2) => {
  const resultString = ['{\n'];

  const generateResultString = (combinedFiles, file1, file2, space = 1, currentPath = '') => {
    const internalString = [''];
    const needingSpace = ('  '.repeat(space));
    Object.keys(combinedFiles).forEach((key) => {
      internalString[0] = '';
      if (_.isPlainObject(combinedFiles[key])) {
        if (returnIncludingFiles(file1, file2, key, {}, currentPath) !== '  ') {
          // only one file includes this obj
          const difference = returnIncludingFiles(file1, file2, key, {}, currentPath);
          internalString[0] += returnStylishObject(key, combinedFiles[key], space, difference);
          resultString[0] += internalString[0];
        } else {
          resultString[0] += `${needingSpace}  ${key}: {\n`;
          generateResultString(combinedFiles[key], file1, file2, space + 2, `${currentPath}/${key}`);
          resultString[0] += `${needingSpace}  }${internalString[0]}\n`;
        }
      } else if (Array.isArray(combinedFiles[key])) {
        // for same keys
        if (_.isPlainObject(combinedFiles[key][0])) {
          internalString[0] += returnStylishObject(key, combinedFiles[key][0], space, '- ');
        } else {
          internalString[0] += `${returnStylishObject(key, combinedFiles[key][0], space, '- ')}\n`;
        }
        if (_.isPlainObject(combinedFiles[key][1])) {
          internalString[0] += returnStylishObject(key, combinedFiles[key][1], space, '+ ');
        } else {
          internalString[0] += `${returnStylishObject(key, combinedFiles[key][1], space, '+ ')}\n`;
        }
        resultString[0] += internalString[0];
      } else {
        internalString[0] += needingSpace;
        internalString[0] += returnIncludingFiles(file1, file2, key, combinedFiles[key], currentPath);
        internalString[0] += `${key}: ${combinedFiles[key]}`;
        resultString[0] += `${internalString[0]}\n`;
      }
    });
  };

  const combinedFiles = sortFile(combineAndSortFiles(file1, file2));
  generateResultString(combinedFiles, file1, file2);
  resultString[0] += '}';
  return resultString[0];
};

export default returnStylishString;
