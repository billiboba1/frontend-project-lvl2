import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import * as fs from 'fs';
import { genDiff } from '../bin/files.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const path1 = path.join(__dirname, '/__fixtures__', '/file1.json');
const path2 = path.join(__dirname, '/__fixtures__', '/file2.json');
const filepathes = [path1, path2];

const rightOutput1 = '{\n  ' + '- follow: false\n  ' + '  host: hexlet.io\n  '
  + '- proxy: 123.234.53.22\n  ' + '- timeout: 50\n  '
  + '+ timeout: 20\n  ' + '+ verbose: true' + '\n}';

test('fileDifference1', () => {
  expect(genDiff(filepathes)).toBe(rightOutput1);
});
