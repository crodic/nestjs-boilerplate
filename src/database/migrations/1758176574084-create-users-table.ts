import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1758176574084 implements MigrationInterface {
  name = 'CreateUsersTable1758176574084';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "username" character varying(50),
          "email" character varying NOT NULL,
          "password" character varying,
          "provider" character varying NOT NULL DEFAULT 'local',
          "provider_id" character varying,
          "bio" character varying NOT NULL DEFAULT '',
          "image" character varying NOT NULL DEFAULT '',
          "deleted_at" TIMESTAMP WITH TIME ZONE,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "created_by" character varying NOT NULL,
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_by" character varying NOT NULL,
          CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_user_username" ON "users" ("username")
      WHERE "deleted_at" IS NULL
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_user_email" ON "users" ("email")
      WHERE "deleted_at" IS NULL
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_user_provider" ON "users" ("provider", "provider_id")
      WHERE "provider_id" IS NOT NULL AND "deleted_at" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."UQ_user_provider"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_user_email"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_user_username"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
