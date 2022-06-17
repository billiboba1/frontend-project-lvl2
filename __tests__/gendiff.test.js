import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import genDiff from '../bin/files.js';
import {
  stylishOutputJSON, stylishOutputYML, plainOutputJSON, plainOutputYML,
  jsonOutputJSON, jsonOutputYML,
} from './__fixtures__/rightAnswers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pathJSON1 = path.join(__dirname, '/__fixtures__', '/file1.json');
const pathJSON2 = path.join(__dirname, '/__fixtures__', '/file2.json');
const pathYML1 = path.join(__dirname, '/__fixtures__', '/file1.yml');
const pathYML2 = path.join(__dirname, '/__fixtures__', '/file2.yml');
const filepathesJSON = [pathJSON1, pathJSON2];
const filepathesYML = [pathYML1, pathYML2];

test('stylishDifference', () => {
  expect(genDiff(filepathesJSON)).toBe(stylishOutputJSON);
  expect(genDiff(filepathesYML)).toBe(stylishOutputYML);
});

test('plainDifference', () => {
  expect(genDiff(filepathesJSON, 'plain')).toBe(plainOutputJSON);
  expect(genDiff(filepathesYML, 'plain')).toBe(plainOutputYML);
});

test('jsonDifference', () => {
  expect(genDiff(filepathesJSON, 'json')).toBe(jsonOutputJSON);
  expect(genDiff(filepathesYML, 'json')).toBe(jsonOutputYML);
});
