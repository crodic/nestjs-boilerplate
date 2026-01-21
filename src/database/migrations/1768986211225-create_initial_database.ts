import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialDatabase1768986211225 implements MigrationInterface {
    name = 'CreateInitialDatabase1768986211225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."sessions_user_enum" AS ENUM('AdminUserEntity', 'UserEntity')
        `);
        await queryRunner.query(`
            CREATE TABLE "sessions" (
                "id" BIGSERIAL NOT NULL,
                "hash" character varying(255) NOT NULL,
                "user_id" bigint NOT NULL,
                "user_type" "public"."sessions_user_enum" NOT NULL,
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
        await queryRunner.query(`
            CREATE TABLE "posts" (
                "id" BIGSERIAL NOT NULL,
                "title" character varying NOT NULL,
                "slug" character varying NOT NULL,
                "description" character varying,
                "content" character varying,
                "user_id" bigint NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                CONSTRAINT "PK_post_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" BIGSERIAL NOT NULL,
                "username" character varying(50),
                "first_name" character varying(100) NOT NULL,
                "last_name" character varying(100),
                "full_name" character varying(201) NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying,
                "bio" character varying,
                "image" character varying,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "verified_at" TIMESTAMP WITH TIME ZONE,
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
            CREATE TABLE "settings" (
                "id" BIGSERIAL NOT NULL,
                "key" character varying NOT NULL,
                "value" jsonb NOT NULL DEFAULT '{}',
                CONSTRAINT "UQ_c8639b7626fa94ba8265628f214" UNIQUE ("key"),
                CONSTRAINT "PK_setting_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "admin_users" (
                "id" BIGSERIAL NOT NULL,
                "username" character varying(50),
                "first_name" character varying(100) NOT NULL,
                "last_name" character varying(100),
                "full_name" character varying(201) NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "bio" character varying,
                "image" character varying,
                "birthday" date,
                "phone" character varying(20),
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "role_id" bigint NOT NULL,
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
        await queryRunner.query(`
            CREATE TABLE "roles" (
                "id" BIGSERIAL NOT NULL,
                "name" character varying NOT NULL,
                "description" character varying,
                "permissions" jsonb NOT NULL DEFAULT '[]',
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                CONSTRAINT "PK_role_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_roles_name" ON "roles" ("name")
            WHERE "deleted_at" IS NULL
        `);
        await queryRunner.query(`
            CREATE TABLE "notifications" (
                "id" BIGSERIAL NOT NULL,
                "actor_id" bigint,
                "title" character varying(255) NOT NULL,
                "message" text,
                "metadata" jsonb DEFAULT '{}',
                "type" character varying(50) NOT NULL DEFAULT 'system',
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_notification_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "notification-recipients" (
                "id" BIGSERIAL NOT NULL,
                "notification_id" bigint NOT NULL,
                "user_id" bigint NOT NULL,
                "isRead" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_notification_recipient_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "audit_logs" (
                "id" BIGSERIAL NOT NULL,
                "entity" character varying NOT NULL,
                "entity_id" bigint,
                "action" character varying NOT NULL,
                "old_value" json,
                "new_value" json,
                "user_id" bigint,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_audit_log_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_audit_logs_entity" ON "audit_logs" ("entity")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_audit_logs_entity_id" ON "audit_logs" ("entity_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_audit_logs_user_id" ON "audit_logs" ("user_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "posts"
            ADD CONSTRAINT "FK_post_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_users"
            ADD CONSTRAINT "FK_admin_user_role" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "notification-recipients"
            ADD CONSTRAINT "FK_recipient_notification_id" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "notification-recipients" DROP CONSTRAINT "FK_recipient_notification_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_users" DROP CONSTRAINT "FK_admin_user_role"
        `);
        await queryRunner.query(`
            ALTER TABLE "posts" DROP CONSTRAINT "FK_post_user_id"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_audit_logs_user_id"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_audit_logs_entity_id"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_audit_logs_entity"
        `);
        await queryRunner.query(`
            DROP TABLE "audit_logs"
        `);
        await queryRunner.query(`
            DROP TABLE "notification-recipients"
        `);
        await queryRunner.query(`
            DROP TABLE "notifications"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."UQ_roles_name"
        `);
        await queryRunner.query(`
            DROP TABLE "roles"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."UQ_admin_user_email"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."UQ_admin_user_username"
        `);
        await queryRunner.query(`
            DROP TABLE "admin_users"
        `);
        await queryRunner.query(`
            DROP TABLE "settings"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."UQ_user_email"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."UQ_user_username"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TABLE "posts"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_sessions_user_id"
        `);
        await queryRunner.query(`
            DROP TABLE "sessions"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."sessions_user_enum"
        `);
    }

}
