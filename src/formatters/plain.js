import _ from 'lodash';
import {
  returnIncludingFiles, normalizeOutput, combineAndSortFiles, sortFile, normalizePath,
  returnAddedPart, returnRemovedPart, returnUpdatedPart,
} from '../functions.js';

const returnPlainString = (file1, file2) => {
  let resultString = '';

  const generateResultString = (combinedFiles, file1, file2, currentPath = '') => {
    for (const key in combinedFiles) {
      const plainPath = normalizePath(`${currentPath}/${key}`);
      if (_.isPlainObject(combinedFiles[key])) {
        if (returnIncludingFiles(file1, file2, key, {}, currentPath) !== '  ') {
          // only one file includes this obj
          const difference = returnIncludingFiles(file1, file2, key, {}, currentPath);
          switch (difference) {
            case '+ ':
              resultString += returnAddedPart(plainPath, '[complex value]');
              break;
            case '- ':
              resultString += returnRemovedPart(plainPath);
              break;
            default:
              break;
          }
        } else {
          generateResultString(combinedFiles[key], file1, file2, `${currentPath}/${key}`);
        }
      } else if (Array.isArray(combinedFiles[key])) {
        // for same keys
        if (_.isPlainObject(combinedFiles[key][1])) {
          if (_.isPlainObject(combinedFiles[key][0])) {
            resultString += returnUpdatedPart(plainPath, '[complex value]', '[complex value]');
          } else {
            resultString += returnUpdatedPart(plainPath, combinedFiles[key][0], '[complex value]');
          }
        } else if (_.isPlainObject(combinedFiles[key][0])) {
          resultString += returnUpdatedPart(plainPath, '[complex value]', combinedFiles[key][1]);
        } else {
          resultString += returnUpdatedPart(plainPath, combinedFiles[key][0],
            combinedFiles[key][1]);
        }
      } else {
        const difference = returnIncludingFiles(file1, file2, key, combinedFiles[key], currentPath);
        switch (difference) {
          case '+ ':
            resultString += returnAddedPart(plainPath, combinedFiles[key]);
            break;
          case '- ':
            resultString += returnRemovedPart(plainPath);
            break;
          default:
            break;
        }
      }
    }
  };

  const combinedFiles = sortFile(combineAndSortFiles(file1, file2));
  generateResultString(combinedFiles, file1, file2);
  return normalizeOutput(resultString);
};

export default returnPlainString;
