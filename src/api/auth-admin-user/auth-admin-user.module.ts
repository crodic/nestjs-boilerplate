import { QueueName, QueuePrefix } from '@/constants/job.constant';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUserModule } from '../admin-user/admin-user.module';
import { AdminUserEntity } from '../admin-user/entities/admin-user.entity';
import { UserEntity } from '../user/entities/user.entity';
import { AuthAdminUserController } from './auth-admin-user.controller';
import { AuthAdminUserService } from './auth-admin-user.service';

@Module({
  imports: [
    AdminUserModule,
    TypeOrmModule.forFeature([UserEntity, AdminUserEntity]),
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
  controllers: [AuthAdminUserController],
  providers: [AuthAdminUserService],
})
export class AuthAdminUserModule {}
