import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiAuth, ApiPublic } from '@/decorators/http.decorators';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RefreshReqDto } from '../dto/refresh.req.dto';
import { RefreshResDto } from '../dto/refresh.res.dto';
import { LoginReqDto } from '../dto/user/login.req.dto';
import { LoginResDto } from '../dto/user/login.res.dto';
import { RegisterReqDto } from '../dto/user/register.req.dto';
import { RegisterResDto } from '../dto/user/register.res.dto';
import { AuthUserService } from '../services/auth-user.service';
import { JwtPayloadType } from '../types/jwt-payload.type';

@ApiTags('Authentication')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthUserController {
  constructor(private readonly authUserService: AuthUserService) {}

  @ApiPublic({
    type: LoginReqDto,
    summary: 'login',
  })
  @Post('sign-in')
  async login(@Body() dto: LoginReqDto): Promise<LoginResDto> {
    return await this.authUserService.signIn(dto);
  }

  @ApiPublic({
    type: RegisterReqDto,
    summary: 'register',
  })
  @Post('sign-up')
  async register(@Body() dto: RegisterReqDto): Promise<RegisterResDto> {
    return await this.authUserService.signUp(dto);
  }

  @ApiAuth({
    summary: 'Logout',
    errorResponses: [400, 401, 403, 500],
  })
  @Post('logout')
  async logout(@CurrentUser() userToken: JwtPayloadType): Promise<void> {
    await this.authUserService.logout(userToken);
  }

  @ApiPublic({
    type: RefreshResDto,
    summary: 'Admin refresh token',
  })
  @Post('refresh')
  async adminRefresh(@Body() dto: RefreshReqDto): Promise<RefreshResDto> {
    return await this.authUserService.refreshToken(dto);
  }

  // @ApiPublic()
  // @Post('forgot-password')
  // async adminForgotPassword(
  //   @Body() dto: ForgotPasswordReqDto,
  // ): Promise<ForgotPasswordResDto> {
  //   return await this.authUserService.forgotPassword(dto);
  // }

  // @ApiPublic()
  // @Get('admin/verify')
  // async verifyEmail(@Query() token: string) {
  //   return await this.authAdminUserService.verifyAccount(token);
  // }

  // @ApiPublic()
  // @Post('admin/verify/resend')
  // async adminResendVerifyEmail() {
  //   return 'resend-verify-email';
  // }
}
