import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiAuth, ApiPublic } from '@/decorators/http.decorators';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminLoginReqDto } from '../dto/admin/admin-login.req.dto';
import { AdminLoginResDto } from '../dto/admin/admin-login.res.dto';
import { AdminRegisterReqDto } from '../dto/admin/admin-register.req.dto';
import { AdminRegisterResDto } from '../dto/admin/admin-register.res.dto';
import { ForgotPasswordReqDto } from '../dto/forgot-password.req.dto';
import { ForgotPasswordResDto } from '../dto/forgot-password.res.dto';
import { RefreshReqDto } from '../dto/refresh.req.dto';
import { RefreshResDto } from '../dto/refresh.res.dto';
import { AuthAdminService } from '../services/auth-admin.service';
import { JwtPayloadType } from '../types/jwt-payload.type';

@ApiTags('Authentication')
@Controller({
  path: 'auth/admin',
  version: '1',
})
export class AuthAdminController {
  constructor(private readonly authAdminService: AuthAdminService) {}

  @ApiPublic({
    type: AdminLoginReqDto,
    summary: 'Admin login',
  })
  @Post('sign-in')
  async login(@Body() dto: AdminLoginReqDto): Promise<AdminLoginResDto> {
    return await this.authAdminService.signIn(dto);
  }

  @ApiPublic({
    type: AdminRegisterReqDto,
    summary: 'Admin register',
  })
  @Post('sign-up')
  async register(
    @Body() dto: AdminRegisterReqDto,
  ): Promise<AdminRegisterResDto> {
    return await this.authAdminService.signUp(dto);
  }

  @ApiAuth({
    summary: 'Logout',
    errorResponses: [400, 401, 403, 500],
  })
  @Post('logout')
  async logout(@CurrentUser() userToken: JwtPayloadType): Promise<void> {
    await this.authAdminService.logout(userToken);
  }

  @ApiPublic({
    type: RefreshResDto,
    summary: 'Admin refresh token',
  })
  @Post('refresh')
  async adminRefresh(@Body() dto: RefreshReqDto): Promise<RefreshResDto> {
    return await this.authAdminService.refreshToken(dto);
  }

  @ApiPublic()
  @Post('forgot-password')
  async adminForgotPassword(
    @Body() dto: ForgotPasswordReqDto,
  ): Promise<ForgotPasswordResDto> {
    return await this.authAdminService.forgotPassword(dto);
  }

  @ApiPublic()
  @Get('admin/verify')
  async verifyEmail(@Query() token: string) {
    return await this.authAdminService.verifyAccount(token);
  }

  @ApiPublic()
  @Post('admin/verify/resend')
  async adminResendVerifyEmail() {
    return 'resend-verify-email';
  }
}
