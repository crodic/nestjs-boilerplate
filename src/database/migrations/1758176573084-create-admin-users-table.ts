import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdminUsersTable1760780182632 implements MigrationInterface {
  name = 'CreateAdminUsersTable1760780182632';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "admin_users" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "username" character varying(50),
          "email" character varying NOT NULL,
          "password" character varying NOT NULL,
          "bio" character varying NOT NULL DEFAULT '',
          "image" character varying NOT NULL DEFAULT '',
          "deleted_at" TIMESTAMP WITH TIME ZONE,
          "role_id" uuid,
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

    await queryRunner.query(`
      ALTER TABLE "admin_users"
      ADD CONSTRAINT "FK_admin_user_role" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."UQ_admin_user_email"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_admin_user_username"`);
    await queryRunner.query(`
      ALTER TABLE "admin_users" DROP CONSTRAINT "FK_admin_user_role"
    `);
    await queryRunner.query(`DROP TABLE "admin_users"`);
  }
}
