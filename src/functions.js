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
      // finding object or not
    }
    if (value === file[key] && requiredPath === currentPath && key === name) {
      return true;
      // found a file
    }
    if (_.isPlainObject(file[key])) {
      if (findElement(file[key], name, value, requiredPath, `${currentPath}/${key}`) === true) {
        return true;
      }
    }
  }
  return false;
};

export const sortFile = (file) => {
  const newArray = Object.keys(file);
  return newArray.sort(sortFn).reduce((acc, key) => {
    acc[key] = file[key];
    return acc;
  }, {});
};

export const combineAndSortFiles = (file1, file2) => {
  const file = _.cloneDeep(file1);
  Object.keys(file2).forEach((key) => {
    if (!(key in file1)) {
      file[key] = file2[key];
    } else if (_.isPlainObject(file1[key]) && _.isPlainObject(file2[key])) {
      file[key] = sortFile(combineAndSortFiles(file[key], file2[key]));
    } else if (file1[key] !== file2[key]) {
      file[key] = [file1[key], file2[key]];
    }
  });
  return file;
};

export const returnIncludingFiles = (file1, file2, key, value, requiredPath) => {
  // return files, which includes chosen part of the file
  if (findElement(file1, key, value, requiredPath)) {
    if (findElement(file2, key, value, requiredPath)) {
      return ('  ');
      // both files includes
    }
    return ('- ');
    // only second file includes
  }
  return ('+ ');
  // only first file includes
};

export const returnStylishObject = (key, value, space, difference = '  ') => {
  const needingSpace = ('  '.repeat(space));
  let returnString = `${needingSpace + difference + key}: `;
  if (_.isPlainObject(value)) {
    returnString += '{\n';
    Object.keys(value).forEach((internalKey) => {
      if (_.isPlainObject(value[internalKey])) {
        returnString += returnStylishObject(internalKey, value[internalKey], space + 2);
      } else {
        returnString += `${needingSpace}      ${internalKey}: ${value[internalKey]}\n`;
      }
    });
    returnString += `${needingSpace}  }\n`;
  } else {
    return returnString + value;
  }
  return returnString;
};

export const normalizePath = (path) => {
  const [empty, ...otherPath] = path.split('/');
  return otherPath.join('.');
};

export const normalizePlainOutput = (path) => {
  const [empty, ...otherOutput] = path.split('\n');
  return otherOutput.join('\n');
};

const returnQuotes = (value) => {
  if (typeof value === 'string' && value !== '[complex value]') {
    return `'${value}'`;
  } if (value === '') {
    return "''";
  }
  return value;
};

export const returnRemovedPart = (path) => `\nProperty '${path}' was removed`;

export const returnAddedPart = (path, value) => `\nProperty '${path}' was added with value: ${returnQuotes(value)}`;

export const returnUpdatedPart = (path, deletedValue, newValue) => `\nProperty '${path}' was updated. From ${returnQuotes(deletedValue)} to ${returnQuotes(newValue)}`;

export const getValueInside = (path, internalObject, value) => {
  const [empty, ...pathes] = path.split('/');
  const putInsideKey = (path, internalObject, value) => {
    const [needingWay, ...other] = path.split('.');
    if (other.length === 0) {
      internalObject[needingWay] = value;
      return internalObject;
    }
    internalObject[needingWay] = putInsideKey(other.join('.'), {}, value);
    return internalObject;
  };
  return putInsideKey(pathes.join('.'), internalObject, value);
};

export const addValueInside = (resultObject, internalObject) => {
  Object.keys(internalObject).forEach((key) => {
    if (_.isPlainObject(resultObject[key]) && Object.keys(resultObject).includes(key)) {
      addValueInside(resultObject[key], internalObject[key]);
    } else {
      Object.assign(resultObject, internalObject);
    }
  });
};

export const returnTrue = () => {
  return true;
};

export const returnFalse = () => {
  return false;
};
