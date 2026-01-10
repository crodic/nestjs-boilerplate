import { CaslAbilityFactory } from '@/libs/casl/ability.factory';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '../role/entities/role.entity';
import { AuthModule } from './../auth/auth.module';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([UserEntity, RoleEntity])],
  controllers: [UserController],
  providers: [UserService, CaslAbilityFactory],
  exports: [UserService],
})
export class UserModule {}
