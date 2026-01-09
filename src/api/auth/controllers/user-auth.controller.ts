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
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ForgotPasswordReqDto } from '../dto/forgot-password.req.dto';
import { ForgotPasswordResDto } from '../dto/forgot-password.res.dto';
import { RefreshReqDto } from '../dto/refresh.req.dto';
import { RefreshResDto } from '../dto/refresh.res.dto';
import { RegisterResDto } from '../dto/register.res.dto';
import { ResendEmailVerifyReqDto } from '../dto/resend-email-verify.req.dto';
import { ResendEmailVerifyResDto } from '../dto/resend-email-verify.res.dto';
import { ResetPasswordReqDto } from '../dto/reset-password.req.dto';
import { LoginReqDto } from '../dto/users/login.req.dto';
import { LoginResDto } from '../dto/users/login.res.dto';
import { RegisterReqDto } from '../dto/users/register.req.dto';
import { UserAuthService } from '../services/user-auth.service';
import { JwtPayloadType } from '../types/jwt-payload.type';

@ApiTags('Authentication')
@Controller({
  path: 'user/auth',
  version: '1',
})
export class UserAuthenticationController {
  constructor(private readonly userAuthService: UserAuthService) {}

  //? USER SECTION
  @ApiPublic({
    type: LoginReqDto,
    summary: '[User] Sign-in',
  })
  @Post('sign-in')
  async signIn(@Body() userLoginDto: LoginReqDto): Promise<LoginResDto> {
    return await this.userAuthService.signIn(userLoginDto);
  }

  @ApiPublic({
    type: RegisterReqDto,
    summary: '[User] Sign-up',
  })
  @Post('sign-up')
  async signUp(@Body() dto: RegisterReqDto): Promise<RegisterResDto> {
    return await this.userAuthService.signUp(dto);
  }

  @ApiPublic({
    type: RefreshResDto,
    summary: '[User] Refresh token',
  })
  @Post('refresh')
  async refresh(@Body() dto: RefreshReqDto): Promise<RefreshResDto> {
    return await this.userAuthService.refreshToken(dto);
  }

  @ApiAuth({
    summary: '[Admin - User] Logout for portal and client',
    errorResponses: [304, 500, 401, 403],
  })
  @Post('logout')
  async logout(@CurrentUser() userToken: JwtPayloadType): Promise<void> {
    await this.userAuthService.logout(userToken);
  }

  @ApiPublic({ type: ForgotPasswordReqDto, summary: '[User] Forgot password' })
  @Post('forgot-password')
  async forgotPassword(
    @Body() dto: ForgotPasswordReqDto,
  ): Promise<ForgotPasswordResDto> {
    return await this.userAuthService.forgotPassword(dto);
  }

  @ApiPublic({ type: ResetPasswordReqDto, summary: '[User] Reset password' })
  @ApiQuery({ name: 'token', type: 'string' })
  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body() dto: ResetPasswordReqDto,
  ) {
    return await this.resetPassword(token, dto);
  }

  @ApiPublic({ summary: '[User] Verify email' })
  @ApiQuery({ name: 'token', type: 'string' })
  @Get('verify/email')
  async verifyEmail(@Query() token: string) {
    return await this.userAuthService.verifyAccount(token);
  }

  @ApiPublic({
    type: ResendEmailVerifyReqDto,
    summary: '[User] Resend verify email',
  })
  @Post('verify/email/resend')
  async resendVerifyEmail(
    @Body() dto: ResendEmailVerifyReqDto,
  ): Promise<ResendEmailVerifyResDto> {
    return this.userAuthService.resendVerifyEmail(dto);
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req) {
    return this.userAuthService.googleLogin(req);
  }
}
