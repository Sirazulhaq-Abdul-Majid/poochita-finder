import 'dotenv/config';

import { DataSource } from 'typeorm';

import AppDataSource from './app.data-source';

const SeedDataSource = new DataSource({
  ...AppDataSource.options,
  migrations: ['database/seeds/**/*.*'],
  migrationsTableName: 'seeds',
});

export default SeedDataSource;
