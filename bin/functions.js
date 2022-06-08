import _ from 'lodash';

export const sortFn = (x, y) => {
  if (x > y) {
    return 1;
  } if (x < y) {
    return -1;
  }
  return 0;
};

export const findElement = (file, name, value, requiredPath, currentPath = '') => {
  for (const key in file) {
    if (_.isPlainObject(value) && key === name && requiredPath === currentPath) {
      return true;
      //finding object or not
    }
    if (value === file[key] && requiredPath === currentPath && key === name) {
      return true;
      //found a file
    }
    if (_.isPlainObject(file[key])) {
      if (findElement(file[key], name, value, requiredPath, currentPath + `/${key}`) != undefined) {
        return true;
      }
    }
  }
};

export const combineAndSortFiles = (file1, file2) => {
  const file = _.cloneDeep(file1);
  for (const key in file2) {
    if (!(key in file1)) {
      file[key] = file2[key];
    } else if (_.isPlainObject(file1[key]) && _.isPlainObject(file2[key])) {
      file[key] = sortFile(combineAndSortFiles(file[key], file2[key]));
    } else if (file1[key] != file2[key]) {
      file[key] = [file1[key], file2[key]];
    }
  }
  return file;
};

export const returnIncludingFiles = (file1, file2, key, value, requiredPath) => {
  //return files, which includes chosen part of the file
  if (findElement(file1, key, value, requiredPath)) {
    if (findElement(file2, key, value, requiredPath)) {
      return ('  ');
      //both files includes
    } else {
      return ('- ');
      //only second file includes
    }
  } else {
    return ('+ ');
    //only first file includes
  }
};

export const returnStylishObject = (key, value, space, difference = '  ') => {
  const needingSpace = ('  '.repeat(space));
  let returnString = needingSpace + difference + key + ': ';
  if (_.isPlainObject(value)) {
    returnString += '{\n';
    for (const internalKey in value) {
      if (_.isPlainObject(value[internalKey])) {
        returnString += returnStylishObject(internalKey, value[internalKey], space + 2);
      } else {
        returnString += `${needingSpace}      ${internalKey}: ${value[internalKey]}\n`;
      }
    }
    returnString += needingSpace + '  }\n';
  } else {
    return returnString + value;
  }
  return returnString;
};

export const returnSameStylishFiles = (key, value, space, difference = '  ') => {
  const needingSpace = ('  '.repeat(space));
  let returnString = needingSpace + difference + key + ': ';
  if (_.isPlainObject(value)) {
    returnString += '{\n';
    for (const internalKey in value) {
      if (_.isPlainObject(value[internalKey])) {
        returnString += returnStylishObject(internalKey, value[internalKey], space + 2);
      } else {
        returnString += `${needingSpace}      ${internalKey}: ${value[internalKey]}\n`;
      }
    }
    returnString += needingSpace + '  }';
  } else {
    return returnString + value;
  }
  return returnString;
};

export const sortFile = (file) => {
  const newArray = Object.keys(file);
  return newArray.sort(sortFn).reduce(
    (acc, key) => {
      acc[key] = file[key];
      return acc;
    }, {}
  );
};

