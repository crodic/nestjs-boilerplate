import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdminUsersTable1758176573084 implements MigrationInterface {
  name = 'CreateAdminUsersTable1758176573084';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "admin_users" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "username" character varying(50),
          "first_name" character varying(100) NOT NULL,
          "last_name" character varying(100),
          "full_name" character varying(201) NOT NULL,
          "birthday" date,
          "phone" character varying(20),
          "email" character varying NOT NULL,
          "password" character varying NOT NULL,
          "bio" character varying,
          "image" character varying,
          "deleted_at" TIMESTAMP WITH TIME ZONE,
          "role_id" uuid NOT NULL,
          "verified_at" TIMESTAMP WITH TIME ZONE,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "created_by" character varying NOT NULL,
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_by" character varying NOT NULL,
          CONSTRAINT "PK_admin_user_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_admin_user_username" ON "admin_users" ("username")
      WHERE "deleted_at" IS NULL
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_admin_user_email" ON "admin_users" ("email")
      WHERE "deleted_at" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."UQ_admin_user_email"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_admin_user_username"`);
    await queryRunner.query(`DROP TABLE "admin_users"`);
  }
}
