import { QueueName, QueuePrefix } from '@/constants/job.constant';
import { SessionEntity } from '@/shared/entities/session.entity';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUserModule } from '../admin-user/admin-user.module';
import { AdminUserEntity } from '../admin-user/entities/admin-user.entity';
import { UserEntity } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { AuthAdminController } from './controllers/auth-admin.controller';
import { AuthUserController } from './controllers/auth-user.controller';
import { AuthAdminService } from './services/auth-admin.service';
import { AuthUserService } from './services/auth-user.service';

@Module({
  imports: [
    AdminUserModule,
    UserModule,
    TypeOrmModule.forFeature([UserEntity, AdminUserEntity, SessionEntity]),
    JwtModule.register({}),
    BullModule.registerQueue({
      name: QueueName.EMAIL,
      prefix: QueuePrefix.AUTH,
      streams: {
        events: {
          maxLen: 1000,
        },
      },
    }),
  ],
  controllers: [AuthAdminController, AuthUserController],
  providers: [AuthAdminService, AuthUserService],
})
export class AuthModule {}
