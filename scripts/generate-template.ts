import { camelCase, capitalCase, paramCase, pascalCase, snakeCase } from 'change-case';
import fs from 'fs';
import path from 'path';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const pluralize = require('pluralize');

const basePath = 'src/modules';
const templatePath = 'template';
rl.question('︖ Enter module name 👉 ', (fileName) => {
  if (!fileName) throw Error('Invalid module name');

  const modulePath = path.join(basePath, paramCase(fileName));
  //Create Folders
  if (!fs.existsSync(modulePath)) {
    fs.mkdirSync(modulePath, { recursive: true });
  }

  const files = fs.readdirSync(templatePath);

  files.forEach((file) => {
    let data = fs.readFileSync(path.join(templatePath, file), { encoding: 'utf-8' });
    data = data.replace(/__table_name__/g, pluralize(snakeCase(fileName)));
    data = data.replace(/template-file/g, paramCase(fileName));
    data = data.replace(/__Template__/g, pascalCase(fileName));
    data = data.replace(/__template__/g, camelCase(fileName));
    data = data.replace(/__templates__/g, pluralize(camelCase(fileName)));

    fs.writeFileSync(
      path.join(modulePath, file.replace('template-file', paramCase(fileName))),
      data,
      'utf-8',
    );
  });
  // eslint-disable-next-line no-console
  console.log(`✨ Generated '${capitalCase(fileName)}' module`);
  process.exit(0);
});
