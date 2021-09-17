import { MigrationInterface, QueryRunner } from "typeorm";

export class PostRefactoringTIMESTAMP implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "first_name" TO "firstName"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "last_name" TO "lastName"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "add_data" TO "addData"`
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "firstName" TO "first_name"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "lastName" TO "last_name"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "addData" TO "add_data"`
    );
  }
}
