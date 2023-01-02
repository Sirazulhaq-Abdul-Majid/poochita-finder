import { execSync } from 'child_process';

const seedName = process.argv[2];
const prefixPath = 'database/seeds/';
try {
  execSync(
    `ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:create ${
      prefixPath + seedName
    }`,
    { stdio: 'inherit' },
  );
} catch (e) {}
