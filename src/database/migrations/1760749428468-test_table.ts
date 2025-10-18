import { MigrationInterface, QueryRunner } from 'typeorm';

export class TestTable1760749428468 implements MigrationInterface {
  name = 'TestTable1760749428468';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."sessions_user_type_enum" AS ENUM('AdminUserEntity', 'UserEntity')
        `);
    await queryRunner.query(`
            CREATE TABLE "sessions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "hash" character varying(255) NOT NULL,
                "user_id" uuid NOT NULL,
                "user_type" "public"."sessions_user_type_enum" NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                CONSTRAINT "PK_session_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_sessions_user_id" ON "sessions" ("user_id")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_sessions_user_id"
        `);
    await queryRunner.query(`
            DROP TABLE "sessions"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."sessions_user_type_enum"
        `);
  }
}
