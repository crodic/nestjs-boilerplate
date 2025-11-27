import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePagesTable1764038438491 implements MigrationInterface {
  name = 'CreatePagesTable1764038438491';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "page-translations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "code" character varying(10) NOT NULL,
                "title" character varying NOT NULL,
                "content" text NOT NULL,
                "page_id" uuid NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_page_translation_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."page_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'DRAFT')
        `);
    await queryRunner.query(`
            CREATE TABLE "pages" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "slug" character varying NOT NULL,
                "meta_keywords" character varying(160),
                "meta_description" character varying(240),
                "status" "public"."page_status_enum" NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                CONSTRAINT "PK_page_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "page-translations"
            ADD CONSTRAINT "FK_page_page_translation_id" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_page_slug" ON "pages" ("slug")
      WHERE "deleted_at" IS NULL
    `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_page_code" ON "page-translations" ("page_id", "code")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."UQ_page_slug"`);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_page_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "page-translations" DROP CONSTRAINT "FK_page_page_translation_id"
        `);
    await queryRunner.query(`
            DROP TABLE "pages"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."page_status_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "page-translations"
        `);
  }
}
