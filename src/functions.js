import _ from 'lodash';

const findElement = (file, name, value, requiredPath, currentPath = '') => {
  const array = Object.keys(file).map((key) => {
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
    return false;
  });
  if (array.includes(true)) {
    return true;
  }
  return false;
};

const fromArrayToObject = (array) => {
  const string = JSON.stringify(array)
    .substring(2, JSON.stringify(array).length - 2)
    .replace(/},{/g, ',');
  return JSON.parse(`{${string}}`);
};

export const sortFile = (file) => {
  const newArray = Object.keys(file);
  const arrayOfObjects = _.sortBy(newArray).map((key) => ({ [key]: file[key] }));
  return fromArrayToObject(arrayOfObjects);
};

export const combineAndSortFiles = (file1, file2) => {
  const newFile = { ...file1, ...file2 };
  const array = Object.keys(newFile).map((key) => {
    if (_.isPlainObject(file1[key]) && _.isPlainObject(file2[key])) {
      return { [key]: sortFile(combineAndSortFiles(file1[key], file2[key])) };
    } if (file1[key] !== file2[key] && file1[key] !== undefined && file2[key] !== undefined) {
      return { [key]: [file1[key], file2[key]] };
    }
    return { [key]: newFile[key] };
  });
  return fromArrayToObject(array);
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
  const begin = `${needingSpace + difference + key}: `;
  if (_.isPlainObject(value)) {
    const innerOutput = Object.keys(value).map((internalKey) => {
      if (_.isPlainObject(value[internalKey])) {
        return returnStylishObject(internalKey, value[internalKey], space + 2);
      }
      return `${needingSpace}      ${internalKey}: ${value[internalKey]}\n`;
    });
    return `${begin}{\n${innerOutput.join('')}${needingSpace}  }\n`;
  }
  return begin + value;
};

export const normalizePath = (path) => {
  const [emptyPart, ...otherPath] = path.split('/');
  return otherPath.join('.');
};

export const normalizePlainOutput = (path) => {
  const [emptyBegin, ...otherOutput] = path.split('\n');
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

export const returnTrue = () => true;

export const returnFalse = () => false;
