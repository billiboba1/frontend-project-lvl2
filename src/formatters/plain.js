import _ from 'lodash';
import {
  returnIncludingFiles, normalizePlainOutput, combineAndSortFiles, sortFile, normalizePath,
  returnAddedPart, returnRemovedPart, returnUpdatedPart,
} from '../functions.js';

const returnPlainString = (file1, file2) => {
  const generateResultString = (combinedFiles, file11, file22, currentPath = '') => {
    const resultArray = Object.keys(combinedFiles).map((key) => {
      const plainPath = normalizePath(`${currentPath}/${key}`);
      if (_.isPlainObject(combinedFiles[key])) {
        if (returnIncludingFiles(file11, file22, key, {}, currentPath) !== '  ') {
          // only one file includes this obj
          const difference = returnIncludingFiles(file11, file22, key, {}, currentPath);
          switch (difference) {
            case '+ ':
              return returnAddedPart(plainPath, '[complex value]');
            case '- ':
              return returnRemovedPart(plainPath);
            default:
              break;
          }
        } else {
          return generateResultString(combinedFiles[key], file11, file22, `${currentPath}/${key}`);
        }
      } else if (Array.isArray(combinedFiles[key])) {
        // for same keys
        if (_.isPlainObject(combinedFiles[key][1])) {
          if (_.isPlainObject(combinedFiles[key][0])) {
            if (true) {
              return returnUpdatedPart(plainPath, '[complex value]', '[complex value]');
            }
          } else {
            if (true) {
              return returnUpdatedPart(plainPath, combinedFiles[key][0], '[complex value]');
            }
          }
        } else if (_.isPlainObject(combinedFiles[key][0])) {
          if (true) {
            return returnUpdatedPart(plainPath, '[complex value]', combinedFiles[key][1]);
          }
        } else {
          if (true) {
            return returnUpdatedPart(plainPath, combinedFiles[key][0], combinedFiles[key][1]);
          }
        }
      } else {
        switch (returnIncludingFiles(file11, file22, key, combinedFiles[key], currentPath)) {
          case '+ ':
            return returnAddedPart(plainPath, combinedFiles[key]);
          case '- ':
            return returnRemovedPart(plainPath);
          default:
            break;
        }
      }
      return '';
    });
    return resultArray.join('');
  };

  const combinedFiles = sortFile(combineAndSortFiles(file1, file2));
  return normalizePlainOutput(generateResultString(combinedFiles, file1, file2));
};

export default returnPlainString;
