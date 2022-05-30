import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import * as fs from 'fs';
import { genDiff } from '../bin/files.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pathJSON1 = path.join(__dirname, '/__fixtures__', '/file1.json');
const pathJSON2 = path.join(__dirname, '/__fixtures__', '/file2.json');
const pathYML1 = path.join(__dirname, '/__fixtures__', '/file1.yml');
const pathYML2 = path.join(__dirname, '/__fixtures__', '/file2.yml');
const filepathesJSON = [pathJSON1, pathJSON2];
const filepathesYML = [pathYML1, pathYML2];

const rightOutput1 = '{\n  ' + '- follow: false\n  ' + '  host: hexlet.io\n  '
  + '- proxy: 123.234.53.22\n  ' + '- timeout: 50\n  '
  + '+ timeout: 20\n  ' + '+ verbose: true' + '\n}';

test('fileDifferenceJSON', () => {
  expect(genDiff(filepathesJSON)).toBe(rightOutput1);
});

test('fileDifferenceYML', () => { 
  expect(genDiff(filepathesYML)).toBe(rightOutput1);
})


