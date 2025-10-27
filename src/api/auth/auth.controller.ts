import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiAuth, ApiPublic } from '@/decorators/http.decorators';
import { GoogleOAuthGuard } from '@/guards/google-oauth.guard';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AdminUserLoginReqDto } from './dto/admin-users/admin-user-login.req.dto';
import { AdminUserLoginResDto } from './dto/admin-users/admin-user-login.res.dto';
import { AdminUserRegisterReqDto } from './dto/admin-users/admin-user-register.req.dto';
import { ForgotPasswordReqDto } from './dto/forgot-password.req.dto';
import { ForgotPasswordResDto } from './dto/forgot-password.res.dto';
import { RefreshReqDto } from './dto/refresh.req.dto';
import { RefreshResDto } from './dto/refresh.res.dto';
import { RegisterResDto } from './dto/register.res.dto';
import { ResendEmailVerifyReqDto } from './dto/resend-email-verify.req.dto';
import { ResendEmailVerifyResDto } from './dto/resend-email-verify.res.dto';
import { ResetPasswordReqDto } from './dto/reset-password.req.dto';
import { LoginReqDto } from './dto/users/login.req.dto';
import { LoginResDto } from './dto/users/login.res.dto';
import { RegisterReqDto } from './dto/users/register.req.dto';
import { JwtPayloadType } from './types/jwt-payload.type';

@ApiTags('Authentication')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //? ADMIN SECTION
  @ApiPublic({
    type: AdminUserLoginReqDto,
    summary: '[Admin] Login',
  })
  @Post('admin/login')
  async login(
    @Body() adminUserLogin: AdminUserLoginReqDto,
  ): Promise<AdminUserLoginResDto> {
    return await this.authService.adminUserLogin(adminUserLogin);
  }

  @ApiPublic({
    type: AdminUserRegisterReqDto,
    summary: '[Admin] Register',
  })
  @Post('admin/register')
  async register(
    @Body() dto: AdminUserRegisterReqDto,
  ): Promise<RegisterResDto> {
    return await this.authService.adminUserRegister(dto);
  }

  @ApiPublic({
    type: RefreshResDto,
    summary: '[Admin] Refresh token',
  })
  @Post('admin/refresh')
  async adminRefresh(@Body() dto: RefreshReqDto): Promise<RefreshResDto> {
    return await this.authService.adminRefreshToken(dto);
  }

  @ApiPublic({
    type: ForgotPasswordReqDto,
    summary: '[Admin] Forgot password',
  })
  @Post('admin/forgot-password')
  async adminForgotPassword(
    @Body() dto: ForgotPasswordReqDto,
  ): Promise<ForgotPasswordResDto> {
    return await this.authService.adminForgotPassword(dto);
  }

  @ApiPublic({ summary: '[Admin] Verify account' })
  @Get('admin/verify')
  async adminVerifyAccount(@Query('token') token: string) {
    return await this.authService.adminVerifyAccount(token);
  }

  @ApiPublic({
    type: ResendEmailVerifyReqDto,
    summary: '[Admin] Resend verify email',
  })
  @Post('admin/verify/resend')
  async adminResendVerifyEmail(
    @Body() dto: ResendEmailVerifyReqDto,
  ): Promise<ResendEmailVerifyResDto> {
    return this.authService.adminResendVerifyEmail(dto);
  }

  @ApiPublic({ type: ResetPasswordReqDto, summary: '[Admin] Reset password' })
  @Post('admin/reset-password')
  async adminResetPassword(
    @Query('token') token: string,
    @Body() dto: ResetPasswordReqDto,
  ) {
    return this.authService.adminResetPassword(token, dto);
  }

  //? USER SECTION
  @ApiPublic({
    type: LoginReqDto,
    summary: '[User] Sign-in',
  })
  @Post('email/sign-in')
  async signIn(@Body() userLoginDto: LoginReqDto): Promise<LoginResDto> {
    return await this.authService.signIn(userLoginDto);
  }

  @ApiPublic({
    type: RegisterReqDto,
    summary: '[User] Sign-up',
  })
  @Post('email/sign-up')
  async signUp(@Body() dto: RegisterReqDto): Promise<RegisterResDto> {
    return await this.authService.signUp(dto);
  }

  @ApiPublic({
    type: RefreshResDto,
    summary: '[User] Refresh token',
  })
  @Post('refresh')
  async refresh(@Body() dto: RefreshReqDto): Promise<RefreshResDto> {
    return await this.authService.refreshToken(dto);
  }

  @ApiAuth({
    summary: '[Admin - User] Logout for portal and client',
    errorResponses: [400, 401, 403, 500],
  })
  @Post('logout')
  async logout(@CurrentUser() userToken: JwtPayloadType): Promise<void> {
    await this.authService.logout(userToken);
  }

  @ApiPublic({ type: ForgotPasswordReqDto, summary: '[User] Forgot password' })
  @Post('forgot-password')
  async forgotPassword(
    @Body() dto: ForgotPasswordReqDto,
  ): Promise<ForgotPasswordResDto> {
    return await this.authService.forgotPassword(dto);
  }

  @ApiPublic({ type: ResetPasswordReqDto, summary: '[User] Reset password' })
  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body() dto: ResetPasswordReqDto,
  ) {
    return await this.resetPassword(token, dto);
  }

  @ApiPublic({ summary: '[User] Verify email' })
  @Get('verify/email')
  async verifyEmail(@Query() token: string) {
    return await this.authService.verifyAccount(token);
  }

  @ApiPublic({
    type: ResendEmailVerifyReqDto,
    summary: '[User] Resend verify email',
  })
  @Post('verify/email/resend')
  async resendVerifyEmail(
    @Body() dto: ResendEmailVerifyReqDto,
  ): Promise<ResendEmailVerifyResDto> {
    return this.authService.resendVerifyEmail(dto);
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req) {
    return this.authService.googleLogin(req);
  }
}
