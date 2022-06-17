import _ from 'lodash';
import yaml from 'js-yaml';

const parseFile = (file, extension) => {
  if (extension === 'json') {
    return JSON.parse(file);
  } if (extension === 'yml' || extension === 'yaml') {
    return yaml.loadAll(file)[0];
  }
  return console.error('error: undefined extension');
};

export default parseFile;
