import fileDif from '../bin/files.js';

const file1 = {
  "host": "hexlet.io",
  "timeout": 50,
  "proxy": "123.234.53.22",
  "follow": false
}

const file2 = {
  "timeout": 20,
  "verbose": true,
  "host": "hexlet.io"
}

const rightOutput1 = '{/n  ' + '- follow: false/n  ' + 'host: hexlet.io/n  ' + 
  '- proxy: 123.234.53.22/n  ' + '- timeout: 50/n  ' +
  '+ timeout: 20/n  ' + '+ verbose: true' + '}';

test('fileDifference1', () => {
  console.log(rightOutput1);
  fileDif(file1, file2).toBe(rightOutput1);
})
