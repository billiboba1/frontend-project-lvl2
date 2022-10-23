import _ from 'lodash';
import {
  returnIncludingFiles, returnStylishObject, combineAndSortFiles, sortFile,
} from '../functions.js';

const returnStylishString = (file1, file2) => {

  const generateResultString = (combinedFiles, file1, file2, space = 1, currentPath = '') => {
    const needingSpace = ('  '.repeat(space));
    const resultArray = Object.keys(combinedFiles).map((key) => {
      if (_.isPlainObject(combinedFiles[key])) {
        if (returnIncludingFiles(file1, file2, key, {}, currentPath) !== '  ') {
          // only one file includes this obj
          const difference = returnIncludingFiles(file1, file2, key, {}, currentPath);
          return returnStylishObject(key, combinedFiles[key], space, difference);
        } else {
          const string = `${needingSpace}  ${key}: {\n` + 
          generateResultString(combinedFiles[key], file1, file2, space + 2, `${currentPath}/${key}`)
           + `${needingSpace}  }\n`;
          return string;
        }
      } else if (Array.isArray(combinedFiles[key])) {
        // for same keys
        if (_.isPlainObject(combinedFiles[key][0])) {
          const string1 = returnStylishObject(key, combinedFiles[key][0], space, '- ');
          if (_.isPlainObject(combinedFiles[key][1])) {
            const string2 = returnStylishObject(key, combinedFiles[key][1], space, '+ ');
            return string1 + string2;
          } else {
            const string2 = `${returnStylishObject(key, combinedFiles[key][1], space, '+ ')}\n`;
            return string1 + string2;
          }
        } else {
          const string1 = `${returnStylishObject(key, combinedFiles[key][0], space, '- ')}\n`;
          if (_.isPlainObject(combinedFiles[key][1])) {
            const string2 = returnStylishObject(key, combinedFiles[key][1], space, '+ ');
            return string1 + string2;
          } else {
            const string2 = `${returnStylishObject(key, combinedFiles[key][1], space, '+ ')}\n`;
            return string1 + string2;
          }
        }
      } else {
        const string = needingSpace +
         returnIncludingFiles(file1, file2, key, combinedFiles[key], currentPath) + 
         `${key}: ${combinedFiles[key]}\n`;
        return string;
      }
    });
    return resultArray.join('');
  };

  const combinedFiles = sortFile(combineAndSortFiles(file1, file2));
  return '{\n' + generateResultString(combinedFiles, file1, file2) + '}';
};

export default returnStylishString;
