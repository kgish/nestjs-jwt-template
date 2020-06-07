import { MigrationInterface, QueryRunner } from 'typeorm';
import * as faker from 'faker';
import { hash, genSalt } from 'bcryptjs';

export class InsertUserTable1591517889420 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    [ 'admin', 'editor', 'user' ].forEach(async role => {
      const username = `${ role }@example.org`;
      const name = faker.name.firstName() + ' ' + faker.name.lastName();
      const salt = await genSalt();
      const password = await hash('admin', salt);
      await queryRunner.query(`
          INSERT INTO "user" (username, name, password, role, salt)
          VALUES ($1, $2, $3, $4, $5)
        `,
        [ username, name, password, role, salt ]);
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query('DELETE FROM "user"');
  }

}
