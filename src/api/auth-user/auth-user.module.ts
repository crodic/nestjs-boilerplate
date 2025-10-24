import { Module } from '@nestjs/common';
import { AuthUserService } from './auth-user.service';
import { AuthUserController } from './auth-user.controller';

@Module({
  controllers: [AuthUserController],
  providers: [AuthUserService],
})
export class AuthUserModule {}
