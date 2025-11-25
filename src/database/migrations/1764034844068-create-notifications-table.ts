import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNotificationsTable1764034844068 implements MigrationInterface {
    name = 'CreateNotificationsTable1764034844068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "notification-recipients" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "notification_id" character varying NOT NULL,
                "user_id" character varying NOT NULL,
                "isRead" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "notificationId" uuid,
                CONSTRAINT "PK_notification_recipient_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "notifications" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "actor_id" character varying,
                "title" character varying(255) NOT NULL,
                "message" text,
                "metadata" jsonb DEFAULT '{}',
                "type" character varying(50) NOT NULL DEFAULT 'system',
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_notification_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "notification-recipients"
            ADD CONSTRAINT "FK_ec26b75c84de4b35d8e851ebda9" FOREIGN KEY ("notificationId") REFERENCES "notifications"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "notification-recipients" DROP CONSTRAINT "FK_ec26b75c84de4b35d8e851ebda9"
        `);
        await queryRunner.query(`
            DROP TABLE "notifications"
        `);
        await queryRunner.query(`
            DROP TABLE "notification-recipients"
        `);
    }

}
