import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiAuth, ApiPublic } from '@/decorators/http.decorators';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthAdminUserService } from './auth-admin-user.service';
import { AdminUserLoginReqDto } from './dto/admin-user-login.req.dto';
import { AdminUserLoginResDto } from './dto/admin-user-login.res.dto';
import { AdminUserRegisterReqDto } from './dto/admin-user-register.req.dto';
import { AdminUserRegisterResDto } from './dto/admin-user-register.res.dto';
import { ForgotPasswordReqDto } from './dto/forgot-password.req.dto';
import { ForgotPasswordResDto } from './dto/forgot-password.res.dto';
import { RefreshReqDto } from './dto/refresh.req.dto';
import { RefreshResDto } from './dto/refresh.res.dto';
import { JwtPayloadType } from './types/jwt-payload.type';

@ApiTags('Authentication')
@Controller({
  path: 'auth/admin',
  version: '1',
})
export class AuthAdminUserController {
  constructor(private readonly authAdminUserService: AuthAdminUserService) {}

  @ApiPublic({
    type: AdminUserLoginReqDto,
    summary: 'Admin login',
  })
  @Post('sign-in')
  async login(
    @Body() dto: AdminUserLoginReqDto,
  ): Promise<AdminUserLoginResDto> {
    return await this.authAdminUserService.signIn(dto);
  }

  @ApiPublic({
    type: AdminUserRegisterReqDto,
    summary: 'Admin register',
  })
  @Post('sign-up')
  async register(
    @Body() dto: AdminUserRegisterReqDto,
  ): Promise<AdminUserRegisterResDto> {
    return await this.authAdminUserService.signUp(dto);
  }

  @ApiAuth({
    summary: 'Logout',
    errorResponses: [400, 401, 403, 500],
  })
  @Post('logout')
  async logout(@CurrentUser() userToken: JwtPayloadType): Promise<void> {
    await this.authAdminUserService.logout(userToken);
  }

  @ApiPublic({
    type: RefreshResDto,
    summary: 'Admin refresh token',
  })
  @Post('refresh')
  async adminRefresh(@Body() dto: RefreshReqDto): Promise<RefreshResDto> {
    return await this.authAdminUserService.refreshToken(dto);
  }

  @ApiPublic()
  @Post('forgot-password')
  async adminForgotPassword(
    @Body() dto: ForgotPasswordReqDto,
  ): Promise<ForgotPasswordResDto> {
    return await this.authAdminUserService.forgotPassword(dto);
  }

  @ApiPublic()
  @Get('admin/verify')
  async verifyEmail(@Query() token: string) {
    return await this.authAdminUserService.verifyAccount(token);
  }

  @ApiPublic()
  @Post('admin/verify/resend')
  async adminResendVerifyEmail() {
    return 'resend-verify-email';
  }
}
