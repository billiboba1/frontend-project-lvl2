import _ from 'lodash';
import {
  returnIncludingFiles, returnStylishObject, combineAndSortFiles, sortFile, normalizePath
} from '../functions.js';

const returnPlainString = () => {
  let resultString = '';

  const generateResultString = (combinedFiles, file1, file2, currentPath = '') => {
    for (const key in combinedFiles) {
      plainPath = normalizePath(currentPath);
      if (_.isPlainObject(combinedFiles[key])) {
        if (returnIncludingFiles(file1, file2, key, {}, currentPath) != '  ') {
          //only one file includes this obj
          const difference = returnIncludingFiles(file1, file2, key, {}, currentPath);
          //if ()
        } else {
          resultString += `${key}: {\n`;
          generateResultString(combinedFiles[key], file1, file2, currentPath + `/${key}`);
          resultString += '  }' + internalString + '\n';
        }
      } else {
        if (Array.isArray(combinedFiles[key])) {
          //for same keys
          //Property 'common.setting6.doge.wow' was updated. From '' to 'so much'
          if (_.isPlainObject(combinedFiles[key][1])) {
            if (_.isPlainObject(combinedFiles[key][0])) {
              resultString += `\nProperty '${plainPath}' was updated. From [complex value] to [complex value]`;
            } else {
              resultString += `\nProperty '${plainPath}' was updated. From '${combinedFiles[key][0]}' to [complex value]`;
            }
          } else {
            if (_.isPlainObject(combinedFiles[key][0])) {
              resultString += `\nProperty '${plainPath}' was updated. From [complex value] to '${combinedFiles[key][1]}'`;
            } else {
              resultString += `\nProperty '${plainPath}' was updated. From '${combinedFiles[key][0]}' to '${combinedFiles[key][1]}'`;
            }
          }
        } else {
          resultString += returnIncludingFiles(file1, file2, key, combinedFiles[key], currentPath);
          resultString += `${} ${}`;
          resultString += internalString + '\n';
        }
      }
    }
  };

  const combinedFiles = sortFile(combineAndSortFiles(file1, file2));
  returnPlainString(combinedFiles, file1, file2);
  resultString += '}';
  return resultString;
};

export default returnPlainString;