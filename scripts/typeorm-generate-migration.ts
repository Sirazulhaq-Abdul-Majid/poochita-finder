import { execSync } from 'child_process';

const migrationName = process.argv[2];
const prefixPath = 'database/migrations/';
try {
  execSync(`yarn typeorm migration:generate ${prefixPath + migrationName}`, { stdio: 'inherit' });
} catch (e) {}
