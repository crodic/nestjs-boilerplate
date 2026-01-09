import { ApiPublic } from '@/decorators/http.decorators';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AdminUserLoginReqDto } from '../dto/admin-users/admin-user-login.req.dto';
import { AdminUserLoginResDto } from '../dto/admin-users/admin-user-login.res.dto';
import { AdminUserRegisterReqDto } from '../dto/admin-users/admin-user-register.req.dto';
import { ForgotPasswordReqDto } from '../dto/forgot-password.req.dto';
import { ForgotPasswordResDto } from '../dto/forgot-password.res.dto';
import { RefreshReqDto } from '../dto/refresh.req.dto';
import { RefreshResDto } from '../dto/refresh.res.dto';
import { RegisterResDto } from '../dto/register.res.dto';
import { ResendEmailVerifyReqDto } from '../dto/resend-email-verify.req.dto';
import { ResendEmailVerifyResDto } from '../dto/resend-email-verify.res.dto';
import { ResetPasswordReqDto } from '../dto/reset-password.req.dto';
import { AdminAuthService } from '../services/admin-auth.service';

@ApiTags('Authentication')
@Controller({
  path: 'auth',
  version: '1',
})
export class AdminAuthenticationController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @ApiPublic({
    type: AdminUserLoginReqDto,
    summary: '[Admin] Login',
  })
  @Post('login')
  async login(
    @Body() adminUserLogin: AdminUserLoginReqDto,
  ): Promise<AdminUserLoginResDto> {
    return await this.adminAuthService.login(adminUserLogin);
  }

  @ApiPublic({
    type: AdminUserRegisterReqDto,
    summary: '[Admin] Register',
  })
  @Post('register')
  async register(
    @Body() dto: AdminUserRegisterReqDto,
  ): Promise<RegisterResDto> {
    return await this.adminAuthService.register(dto);
  }

  @ApiPublic({
    type: RefreshResDto,
    summary: '[Admin] Refresh token',
  })
  @Post('refresh')
  async adminRefresh(@Body() dto: RefreshReqDto): Promise<RefreshResDto> {
    return await this.adminAuthService.refreshToken(dto);
  }

  @ApiPublic({
    type: ForgotPasswordReqDto,
    summary: '[Admin] Forgot password',
  })
  @Post('forgot-password')
  async adminForgotPassword(
    @Body() dto: ForgotPasswordReqDto,
  ): Promise<ForgotPasswordResDto> {
    return await this.adminAuthService.forgotPassword(dto);
  }

  @ApiPublic({ summary: '[Admin] Verify account' })
  @ApiQuery({ name: 'token', type: 'string' })
  @Get('verify')
  async adminVerifyAccount(@Query('token') token: string) {
    return await this.adminAuthService.verifyAccount(token);
  }

  @ApiPublic({
    type: ResendEmailVerifyReqDto,
    summary: '[Admin] Resend verify email',
  })
  @Post('verify/resend')
  async adminResendVerifyEmail(
    @Body() dto: ResendEmailVerifyReqDto,
  ): Promise<ResendEmailVerifyResDto> {
    return this.adminAuthService.resendVerifyEmail(dto);
  }

  @ApiPublic({ type: ResetPasswordReqDto, summary: '[Admin] Reset password' })
  @ApiQuery({ name: 'token', type: 'string' })
  @Post('reset-password')
  async adminResetPassword(
    @Query('token') token: string,
    @Body() dto: ResetPasswordReqDto,
  ) {
    return this.adminAuthService.resetPassword(token, dto);
  }
}
