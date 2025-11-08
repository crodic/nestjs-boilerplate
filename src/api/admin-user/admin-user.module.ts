import { CaslAbilityFactory } from '@/libs/casl/ability.factory';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '../role/entities/role.entity';
import { AdminUserController } from './admin-user.controller';
import { AdminUserService } from './admin-user.service';
import { AdminUserEntity } from './entities/admin-user.entity';

@Module({
  controllers: [AdminUserController],
  providers: [AdminUserService, CaslAbilityFactory],
  imports: [TypeOrmModule.forFeature([RoleEntity, AdminUserEntity])],
})
export class AdminUserModule {}
