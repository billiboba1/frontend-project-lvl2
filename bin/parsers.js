import _ from 'lodash';
import yaml from 'js-yaml';

const parseFile = (file, extension) => {
  if (extension === 'json') {
    return JSON.parse(file);
  } else if (extension === 'yml' || extension === 'yaml') {
    return yaml.loadAll(file)[0];
  }
  return 0;
  return console.error('undefined extension');
}

export default parseFile;