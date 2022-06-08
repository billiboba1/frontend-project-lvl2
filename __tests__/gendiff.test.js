import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { genDiff } from '../bin/files.js';
import { rightOutputJSON } from './__fixtures__/rightAnswerJSON.js';
import { rightOutputYML } from './__fixtures__/rightAnswerYML.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pathJSON1 = path.join(__dirname, '/__fixtures__', '/file1.json');
const pathJSON2 = path.join(__dirname, '/__fixtures__', '/file2.json');
const pathYML1 = path.join(__dirname, '/__fixtures__', '/file1.yml');
const pathYML2 = path.join(__dirname, '/__fixtures__', '/file2.yml');
const filepathesJSON = [pathJSON1, pathJSON2];
const filepathesYML = [pathYML1, pathYML2];

test('fileDifferenceJSON', () => {
  expect(genDiff(filepathesJSON)).toBe(rightOutputJSON);
});

test('fileDifferenceYML', () => { 
  expect(genDiff(filepathesYML)).toBe(rightOutputYML);
});


