import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSettingsTable1768710635248 implements MigrationInterface {
  name = 'CreateSettingsTable1768710635248';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "settings" (
                "id" BIGSERIAL NOT NULL,
                "key" character varying NOT NULL,
                "value" jsonb NOT NULL DEFAULT '{}',
                CONSTRAINT "UQ_c8639b7626fa94ba8265628f214" UNIQUE ("key"),
                CONSTRAINT "PK_setting_id" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "settings"
        `);
  }
}
