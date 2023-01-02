import { pascalCase } from 'change-case';
import fs from 'fs';
import glob from 'glob';
import path from 'path';

const basePath = 'src/modules';

const moduleNames = fs
  .readdirSync(basePath)
  .filter((file) => fs.statSync(basePath + '/' + file).isDirectory());

type ErrorMessage = {
  moduleName: string;
  fromFile: 'input' | 'entity';
  propertyType: 'Graphql Decoration' | 'Property';
  propertyName: string;
};
const errorMessages: ErrorMessage[] = [];

moduleNames.forEach((moduleName) => {
  const files = glob.sync(path.join(basePath, moduleName, '**/*.{entity,input}.ts'));
  if (files.length !== 2) {
    return;
  }

  const entityFile = fs.readFileSync(files[0]).toString();

  const entityColumns = [...entityFile.matchAll(/(@.*)[\s]*(@Column.*)[\s]*(.*;)/g)].map((m) => {
    const decorators = m?.[0] ?? '';
    const graphqlField = [...decorators.matchAll(/@FilterableField.*/g)]?.[0]?.[0] ?? '';
    const column = [...decorators.matchAll(/@Column.*/g)]?.[0]?.[0] ?? '';
    const property = [...decorators.matchAll(/[\w?]*:.*;/g)]?.[0]?.[0] ?? '';

    return {
      graphqlField,
      column,
      property,
      propertyName: property.split(':')[0].replace('?', ''),
      isNullableGqlDecorator: graphqlField.includes('nullable: true'),
      isNullableColumn: column.includes('nullable: true'),
      isNullableProperty: property.includes('?'),
      canInputNullable: column.includes('nullable: true') || column.includes('default:'),
    };
  });

  const entityColumnMap = {};
  entityColumns.forEach((col) => {
    entityColumnMap[col.propertyName] = col;
    if (col.isNullableColumn !== col.isNullableProperty) {
      errorMessages.push({
        moduleName,
        fromFile: 'entity',
        propertyType: 'Property',
        propertyName: col.propertyName,
      });
    }
    if (col.isNullableColumn !== col.isNullableGqlDecorator) {
      errorMessages.push({
        moduleName,
        fromFile: 'entity',
        propertyType: 'Graphql Decoration',
        propertyName: col.propertyName,
      });
    }
  });

  const inputFile = fs.readFileSync(files[1]).toString();

  const inputFieldsRegexp = new RegExp(
    `export class Create${pascalCase(moduleName)}Input {[\\s]*([\\s\\w:;?@()=>[\\]]*)`,
    'g',
  );

  const matches = [...inputFile.matchAll(inputFieldsRegexp)]?.[0]?.[0]?.matchAll(/[\w?]*:/g) ?? [];
  const inputFields = [...matches].map((p) => ({
    name: p[0].replace(':', '').replace('?', ''),
    isNullable: p[0].includes('?'),
  }));

  inputFields.forEach((inputField) => {
    const entity = entityColumnMap[inputField.name];
    if (!entity) return;

    if (!entity.canInputNullable && inputField.isNullable) {
      errorMessages.push({
        moduleName,
        fromFile: 'input',
        propertyType: 'Property',
        propertyName: inputField.name,
      });
    }
  });
});

if (errorMessages.length > 0) {
  const messages = errorMessages.map((err) => {
    const msg = `${path.join(basePath, err.moduleName, `${err.moduleName}.${err.fromFile}.ts`)}: ${
      err.propertyType
    } "${err.propertyName}". `;

    const solution =
      err.propertyType === 'Property' ? `Missing "?"` : 'Missing "{ nullable:true }"';

    return msg + solution;
  });
  messages.forEach((msg) => console.log('\x1b[31m', msg));
  console.log(`Error count: ${errorMessages.length}`);
}
