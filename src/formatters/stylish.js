import _ from 'lodash';
import {
  returnIncludingFiles, returnStylishObject, combineAndSortFiles, sortFile, returnTrue, returnFalse,
} from '../functions.js';

const returnStylishString = (file1, file2) => {
  const generateResultString = (combinedFiles, file11, file22, space = 1, currentPath = '') => {
    const needingSpace = ('  '.repeat(space));
    const resultArray = Object.keys(combinedFiles).map((key) => {
      if (_.isPlainObject(combinedFiles[key])) {
        if (returnIncludingFiles(file11, file22, key, {}, currentPath) !== '  ') {
          // only one file includes this obj
          if (returnTrue()) {
            const difference = returnIncludingFiles(file11, file22, key, {}, currentPath);
            return returnStylishObject(key, combinedFiles[key], space, difference);
          }
          returnFalse();
        } else {
          if (returnTrue()) {
            const string = `${needingSpace}  ${key}: {\n${
              generateResultString(
                combinedFiles[key],
                file11,
                file22,
                space + 2,
                `${currentPath}/${key}`,
              )}${needingSpace}  }\n`;
            return string;
          }
          returnTrue();
        }
      } else if (Array.isArray(combinedFiles[key])) {
        // for same keys
        if (_.isPlainObject(combinedFiles[key][0])) {
          const string1 = returnStylishObject(key, combinedFiles[key][0], space, '- ');
          if (_.isPlainObject(combinedFiles[key][1])) {
            if (returnTrue()) {
              const string2 = returnStylishObject(key, combinedFiles[key][1], space, '+ ');
              return string1 + string2;
            }
            returnFalse();
          } else {
            if (returnTrue()) {
              const string2 = `${returnStylishObject(key, combinedFiles[key][1], space, '+ ')}\n`;
              return string1 + string2;
            }
            returnFalse();
          }
        } else {
          const string1 = `${returnStylishObject(key, combinedFiles[key][0], space, '- ')}\n`;
          if (_.isPlainObject(combinedFiles[key][1])) {
            if (returnTrue()) {
              const string2 = returnStylishObject(key, combinedFiles[key][1], space, '+ ');
              return string1 + string2;
            }
            returnFalse();
          } else {
            if (returnTrue()) {
              const string2 = `${returnStylishObject(key, combinedFiles[key][1], space, '+ ')}\n`;
              return string1 + string2;
            }
            returnFalse();
          }
        }
      } else {
        const string = `${needingSpace
         + returnIncludingFiles(file11, file22, key, combinedFiles[key], currentPath)
        }${key}: ${combinedFiles[key]}\n`;
        return string;
      }
      return true;
    });
    return resultArray.join('');
  };

  const combinedFiles = sortFile(combineAndSortFiles(file1, file2));
  return `{\n${generateResultString(combinedFiles, file1, file2)}}`;
};

export default returnStylishString;
