import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUserEntity } from '../admin-user/entities/admin-user.entity';
import { UserEntity } from '../user/entities/user.entity';
import { AuthAdminUserController } from './auth-admin-user.controller';
import { AuthAdminUserService } from './auth-admin-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, AdminUserEntity])],
  controllers: [AuthAdminUserController],
  providers: [AuthAdminUserService],
})
export class AuthAdminUserModule {}
