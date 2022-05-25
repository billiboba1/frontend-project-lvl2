import { genDiff } from "../bin/files.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const path1 = path.join(__dirname__, '/__fixtures__', '/file1.json');
const path2 = path.join(__dirname__, '/__fixtures__', '/file2.json');
const file1 = fs.readFileSync(path1, "utf8");
const file2 = fs.readFileSync(path2, "utf8");

const rightOutput1 = '{/n  ' + '- follow: false/n  ' + 'host: hexlet.io/n  ' +
  '- proxy: 123.234.53.22/n  ' + '- timeout: 50/n  ' +
  '+ timeout: 20/n  ' + '+ verbose: true' + '}';

test('fileDifference1', () => {
  console.log(rightOutput1);
  genDiff(file1, file2).toBe(rightOutput1);
})
