import _ from 'lodash';
import {
  returnIncludingFiles, normalizeOutput, combineAndSortFiles, sortFile, normalizePath,
  returnAddedPart, returnRemovedPart, returnUpdatedPart,
} from '../functions.js';

const returnPlainString = (file1, file2) => {
  const resultString = {string: ''};
  resultString.newString = 'newString';
  const generateResultString = (combinedFiles, file11, file22, currentPath = '') => {
    Object.keys(combinedFiles).forEach((key) => {
      const plainPath = normalizePath(`${currentPath}/${key}`);
      if (_.isPlainObject(combinedFiles[key])) {
        if (returnIncludingFiles(file11, file22, key, {}, currentPath) !== '  ') {
          // only one file includes this obj
          const difference = returnIncludingFiles(file11, file22, key, {}, currentPath);
          switch (difference) {
            case '+ ':
              resultString.string += returnAddedPart(plainPath, '[complex value]');
              break;
            case '- ':
              resultString.string += returnRemovedPart(plainPath);
              break;
            default:
              break;
          }
        } else {
          generateResultString(combinedFiles[key], file11, file22, `${currentPath}/${key}`);
        }
      } else if (Array.isArray(combinedFiles[key])) {
        // for same keys
        if (_.isPlainObject(combinedFiles[key][1])) {
          if (_.isPlainObject(combinedFiles[key][0])) {
            resultString.string += returnUpdatedPart(plainPath, '[complex value]', '[complex value]');
          } else {
            resultString.string += returnUpdatedPart(plainPath, combinedFiles[key][0], '[complex value]');
          }
        } else if (_.isPlainObject(combinedFiles[key][0])) {
          resultString.string += returnUpdatedPart(plainPath, '[complex value]', combinedFiles[key][1]);
        } else {
          resultString.string += returnUpdatedPart(plainPath, combinedFiles[key][0], combinedFiles[key][1]);
        }
      } else {
        const difference = returnIncludingFiles(file11, file22, key, combinedFiles[key], currentPath);
        switch (difference) {
          case '+ ':
            resultString.string += returnAddedPart(plainPath, combinedFiles[key]);
            break;
          case '- ':
            resultString.string += returnRemovedPart(plainPath);
            break;
          default:
            break;
        }
      }
    });
  };

  const combinedFiles = sortFile(combineAndSortFiles(file1, file2));
  generateResultString(combinedFiles, file1, file2);
  return normalizeOutput(resultString.string);
};

export default returnPlainString;
