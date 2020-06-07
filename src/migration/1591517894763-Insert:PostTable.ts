import { MigrationInterface, QueryRunner } from 'typeorm';
import * as faker from 'faker';

export class InsertPostTable1591517894763 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const user = await queryRunner.query('SELECT * FROM "user" where "role" = $1', [ 'user' ]);
    const authorId = user[0].id;
    const MAX = 10;

    // Create five posts and assign author to user.
    for (let i = 0; i < MAX; i++) {
      const title = faker.lorem.sentence(faker.random.number({ min: 4, max: 7 }));
      const body = faker.lorem.paragraphs(faker.random.number({min: 2, max: 5}));
      await queryRunner.query(`
          INSERT INTO "post" (title, body, "authorId")
          VALUES ($1, $2, $3)
        `,
        [ title, body, authorId ]);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM "post"');
  }

}
