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

  @ApiPublic({
    type: AdminUserLoginReqDto,
    summary: 'Admin login',
  })
  @Post('admin/login')
  async login(
    @Body() adminUserLogin: AdminUserLoginReqDto,
  ): Promise<AdminUserLoginResDto> {
    return await this.authService.adminUserLogin(adminUserLogin);
  }

  @ApiPublic({
    type: AdminUserRegisterReqDto,
    summary: 'Admin register',
  })
  @Post('admin/register')
  async register(
    @Body() dto: AdminUserRegisterReqDto,
  ): Promise<RegisterResDto> {
    return await this.authService.adminUserRegister(dto);
  }

  @ApiPublic({
    type: RefreshResDto,
    summary: 'Admin refresh token',
  })
  @Post('admin/refresh')
  async adminRefresh(@Body() dto: RefreshReqDto): Promise<RefreshResDto> {
    return await this.authService.adminRefreshToken(dto);
  }

  @ApiPublic()
  @Post('admin/forgot-password')
  async adminForgotPassword(
    @Body() dto: ForgotPasswordReqDto,
  ): Promise<ForgotPasswordResDto> {
    return await this.authService.adminForgotPassword(dto);
  }

  @ApiPublic()
  @Get('admin/verify')
  async adminVerifyEmail(@Query() token: string) {
    return await this.authService.verifyAdminAccount(token);
  }

  @ApiPublic()
  @Post('admin/verify/resend')
  async adminResendVerifyEmail() {
    return 'resend-verify-email';
  }

  @ApiPublic({
    type: LoginReqDto,
    summary: 'User sign-in',
  })
  @Post('email/sign-in')
  async signIn(@Body() userLoginDto: LoginReqDto): Promise<LoginResDto> {
    return await this.authService.signIn(userLoginDto);
  }

  @ApiPublic({
    type: RegisterReqDto,
    summary: 'User sign-up',
  })
  @Post('email/sign-up')
  async signUp(@Body() dto: RegisterReqDto): Promise<RegisterResDto> {
    return await this.authService.signUp(dto);
  }

  @ApiPublic({
    type: RefreshResDto,
    summary: 'Refresh token',
  })
  @Post('refresh')
  async refresh(@Body() dto: RefreshReqDto): Promise<RefreshResDto> {
    return await this.authService.refreshToken(dto);
  }

  @ApiAuth({
    summary: 'Logout',
    errorResponses: [400, 401, 403, 500],
  })
  @Post('logout')
  async logout(@CurrentUser() userToken: JwtPayloadType): Promise<void> {
    await this.authService.logout(userToken);
  }

  @ApiPublic()
  @Post('forgot-password')
  async forgotPassword(
    @Body() dto: ForgotPasswordReqDto,
  ): Promise<ForgotPasswordResDto> {
    return await this.authService.adminForgotPassword(dto);
  }

  @ApiPublic()
  @Post('verify/forgot-password')
  async verifyForgotPassword() {
    return 'verify-forgot-password';
  }

  @ApiPublic()
  @Post('reset-password')
  async resetPassword() {
    return 'reset-password';
  }

  @ApiPublic()
  @Get('verify/email')
  async verifyEmail(@Query() token: string) {
    return await this.authService.verifyAdminAccount(token);
  }

  @ApiPublic()
  @Post('verify/email/resend')
  async resendVerifyEmail() {
    return 'resend-verify-email';
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
