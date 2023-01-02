import { UserEntity } from '@entities';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1663053511947 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userRepo = queryRunner.manager.getRepository(UserEntity);

    const user = userRepo.create({
      name: 'admin',
      email: 'admin@mail.com',
      passwordHash: '$2b$10$hNmc/WglKhkwXvqNjSg96ub/VeRww4TquuOpJHQETBC07mKqDfSLa', // 1234
    });
    await userRepo.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
