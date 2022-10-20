import _ from 'lodash';
import {
  returnIncludingFiles, normalizePlainOutput, combineAndSortFiles, sortFile, normalizePath,
  returnAddedPart, returnRemovedPart, returnUpdatedPart,
} from '../functions.js';

const returnPlainString = (file1, file2) => {
  const generateResultString = (combinedFiles, file11, file22, currentPath = '') => {
    const resultArray = Object.keys(combinedFiles).map((key) => {
      //console.log(key);
      //console.log('0');
      const plainPath = normalizePath(`${currentPath}/${key}`);
      if (_.isPlainObject(combinedFiles[key])) {
        //console.log('1');
        if (returnIncludingFiles(file11, file22, key, {}, currentPath) !== '  ') {
          // only one file includes this obj
          const difference = returnIncludingFiles(file11, file22, key, {}, currentPath);
          switch (difference) {
            case '+ ':
              //console.log(returnAddedPart(plainPath, '[complex value]'));
              return returnAddedPart(plainPath, '[complex value]');
            case '- ':
              //console.log(returnRemovedPart(plainPath));
              return returnRemovedPart(plainPath);
            default:
              break;
          }
        } else {
          return generateResultString(combinedFiles[key], file11, file22, `${currentPath}/${key}`);
        }
      } else if (Array.isArray(combinedFiles[key])) {
        //console.log('2');
        // for same keys
        if (_.isPlainObject(combinedFiles[key][1])) {
          if (_.isPlainObject(combinedFiles[key][0])) {
            //console.log(returnUpdatedPart(plainPath, '[complex value]', '[complex value]'));
            return returnUpdatedPart(plainPath, '[complex value]', '[complex value]');
          } else {
            //console.log(returnUpdatedPart(plainPath, combinedFiles[key][0], '[complex value]'));
            return returnUpdatedPart(plainPath, combinedFiles[key][0], '[complex value]');
          }
        } else if (_.isPlainObject(combinedFiles[key][0])) {
          //console.log(returnUpdatedPart(plainPath, '[complex value]', combinedFiles[key][1]));
          return returnUpdatedPart(plainPath, '[complex value]', combinedFiles[key][1]);
        } else {
          //console.log(returnUpdatedPart(plainPath, combinedFiles[key][0], combinedFiles[key][1]));
          return returnUpdatedPart(plainPath, combinedFiles[key][0], combinedFiles[key][1]);
        }
      } else {
        //console.log('3');
        const difference = returnIncludingFiles(file11, file22, key, combinedFiles[key], currentPath);
        //console.log(difference);
        switch (difference) {
          case '+ ':
            //console.log(returnAddedPart(plainPath, combinedFiles[key]));
            return returnAddedPart(plainPath, combinedFiles[key]);
          case '- ':
            //console.log(returnRemovedPart(plainPath));
            return returnRemovedPart(plainPath);
          default:
            break;
        }
      }
      //console.log(4);
    });
    //console.log(resultArray.join(''));
    return resultArray.join('');
  };

  const combinedFiles = sortFile(combineAndSortFiles(file1, file2));
  return normalizePlainOutput(generateResultString(combinedFiles, file1, file2));
};

export default returnPlainString;
