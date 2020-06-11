import {MigrationInterface, QueryRunner} from 'typeorm';
import * as faker from 'faker';

export class InsertPostTable1591517894763 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.query('SELECT * FROM "user" where "role" = $1', ['user']);
    const num = users.length;
    for (let i = 0; i < num; i++) {

      const authorId = users[i].id;
      const max = faker.random.number({min: 2, max: 5});

      // Create max posts and assign author to user.
      for (let j = 0; j < max; j++) {
        const title = faker.lorem.sentence(faker.random.number({min: 4, max: 7}));
        const body = faker.lorem.paragraphs(faker.random.number({min: 2, max: 5}));
        await queryRunner.query(` INSERT INTO "post" (title, body, "authorId") VALUES ($1, $2, $3) `,
          [title, body, authorId]);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM "post"');
  }

}
