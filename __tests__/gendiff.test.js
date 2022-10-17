import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { test, expect } from '@jest/globals';
import genDiff from '../bin/files.js';
import {
  stylishOutputJSON, stylishOutputYML, plainOutputJSON, plainOutputYML,
  jsonOutputJSON, jsonOutputYML,
} from '../__fixtures__/rightAnswers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pathJSON1 = path.join(__dirname, '..', '__fixtures__', 'file1.json');
const pathJSON2 = path.join(__dirname, '..', '__fixtures__', 'file2.json');
const pathYML1 = path.join(__dirname, '..', '__fixtures__', 'file1.yml');
const pathYML2 = path.join(__dirname, '..', '__fixtures__', 'file2.yml');

test('stylishDifference', () => {
  expect(genDiff(pathJSON1, pathJSON2)).toBe(stylishOutputJSON);
  expect(genDiff(pathYML1, pathYML2)).toBe(stylishOutputYML);
});

test('plainDifference', () => {
  expect(genDiff(pathJSON1, pathJSON2, 'plain')).toBe(plainOutputJSON);
  expect(genDiff(pathYML1, pathYML2, 'plain')).toBe(plainOutputYML);
});

test('jsonDifference', () => {
  expect(genDiff(pathJSON1, pathJSON2, 'json')).toBe(jsonOutputJSON);
  expect(genDiff(pathYML1, pathYML2, 'json')).toBe(jsonOutputYML);
});
