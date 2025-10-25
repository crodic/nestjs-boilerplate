import {
  IEmailJob,
  IForgotPasswordEmailJob,
  IVerifyEmailJob,
} from '@/common/interfaces/job.interface';
import { Branded } from '@/common/types/types';
import { AllConfigType } from '@/config/config.type';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { CacheKey } from '@/constants/cache.constant';
import { ESessionUserType } from '@/constants/entity.enum';
import { ErrorCode } from '@/constants/error-code.constant';
import { JobName, QueueName } from '@/constants/job.constant';
import { ValidationException } from '@/exceptions/validation.exception';
import { createCacheKey } from '@/utils/cache.util';
import { verifyPassword } from '@/utils/password.util';
import { InjectQueue } from '@nestjs/bullmq';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { plainToInstance } from 'class-transformer';
import crypto from 'crypto';
import ms from 'ms';
import { Repository } from 'typeorm';
import { AdminUserEntity } from '../admin-user/entities/admin-user.entity';
import { RoleEntity } from '../role/entities/role.entity';
import { SessionEntity } from '../session/entities/session.entity';
import { UserEntity } from '../user/entities/user.entity';
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
import { VerifyAccountResDto } from './dto/verify-account.req.dto';
import { JwtForgotPasswordPayload } from './types/jwt-forgot-password-payload';
import { JwtPayloadType } from './types/jwt-payload.type';
import { JwtRefreshPayloadType } from './types/jwt-refresh-payload.type';

type Token = Branded<
  {
    accessToken: string;
    refreshToken: string;
    tokenExpires: number;
  },
  'token'
>;

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(AdminUserEntity)
    private readonly adminUserRepository: Repository<AdminUserEntity>,
    @InjectQueue(QueueName.EMAIL)
    private readonly emailQueue: Queue<IEmailJob, any, string>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  //? ADMIN SECTION
  async adminUserLogin(
    dto: AdminUserLoginReqDto,
  ): Promise<AdminUserLoginResDto> {
    const { email, password } = dto;
    console.log({ email });
    console.log(await this.adminUserRepository.count());
    const user = await this.adminUserRepository.findOne({
      where: { email },
    });

    const all = await this.adminUserRepository.find({
      select: ['id', 'email'],
    });
    console.log(all);

    console.log(user);

    const isPasswordValid =
      user && (await verifyPassword(password, user.password));

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session = new SessionEntity({
      hash,
      userId: user.id,
      createdBy: SYSTEM_USER_ID,
      updatedBy: SYSTEM_USER_ID,
      userType: ESessionUserType.ADMIN,
    });
    await session.save();

    const token = await this.createToken({
      id: user.id,
      sessionId: session.id,
      role: user.role,
      hash,
    });

    console.log(token);

    return plainToInstance(AdminUserLoginResDto, {
      userId: user.id,
      ...token,
    });
  }

  async adminUserRegister(
    dto: AdminUserRegisterReqDto,
  ): Promise<RegisterResDto> {
    // Check if the user already exists
    const isExistUser = await AdminUserEntity.exists({
      where: { email: dto.email },
    });

    if (isExistUser) {
      throw new ValidationException(ErrorCode.E003);
    }

    // Register user
    const user = new AdminUserEntity({
      email: dto.email,
      password: dto.password,
      roleId: dto.roleId,
      createdBy: SYSTEM_USER_ID,
      updatedBy: SYSTEM_USER_ID,
    });

    await user.save();

    // Send email verification
    const token = await this.createVerificationToken({ id: user.id });
    const tokenExpiresIn = this.configService.getOrThrow(
      'auth.confirmEmailExpires',
      {
        infer: true,
      },
    );
    await this.cacheManager.set(
      createCacheKey(CacheKey.EMAIL_VERIFICATION, user.id),
      token,
      ms(tokenExpiresIn),
    );
    await this.emailQueue.add(
      JobName.EMAIL_VERIFICATION,
      {
        email: dto.email,
        token,
      } as IVerifyEmailJob,
      { attempts: 3, backoff: { type: 'exponential', delay: 60000 } },
    );

    return plainToInstance(RegisterResDto, {
      userId: user.id,
    });
  }

  async verifyAdminAccount(token: string): Promise<VerifyAccountResDto> {
    const { id } = this.verifyVerificationToken(token);

    const user = await this.adminUserRepository.findOneBy({ id });

    if (!user) {
      throw new UnauthorizedException();
    }

    user.verifiedAt = new Date();
    await user.save();

    await this.cacheManager.del(
      createCacheKey(CacheKey.EMAIL_VERIFICATION, id),
    );

    return plainToInstance(VerifyAccountResDto, {
      verified: true,
      message: 'Your account has been verified',
      userId: user.id,
    });
  }

  async adminRefreshToken(dto: RefreshReqDto): Promise<RefreshResDto> {
    const { sessionId, hash } = this.verifyRefreshToken(dto.refreshToken);
    const session = await SessionEntity.findOneBy({ id: sessionId });

    if (!session || session.hash !== hash) {
      throw new UnauthorizedException();
    }

    const user = await this.adminUserRepository.findOneOrFail({
      where: { id: session.userId },
      select: ['id'],
    });

    const newHash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    SessionEntity.update(session.id, { hash: newHash });

    return await this.createToken({
      id: user.id,
      sessionId: session.id,
      hash: newHash,
    });
  }

  async adminForgotPassword(
    dto: ForgotPasswordReqDto,
  ): Promise<ForgotPasswordResDto> {
    const admin = await this.adminUserRepository.findOneOrFail({
      where: { email: dto.email },
    });

    if (!admin) {
      throw new ValidationException(ErrorCode.E004);
    }

    const token = await this.createForgotToken({ id: admin.id });
    const tokenExpiresIn = this.configService.getOrThrow(
      'auth.forgotPasswordExpires',
      {
        infer: true,
      },
    );

    await this.cacheManager.set(
      createCacheKey(CacheKey.FORGOT_PASSWORD, admin.id),
      token,
      ms(tokenExpiresIn),
    );

    await this.emailQueue.add(
      JobName.EMAIL_FORGOT_PASSWORD,
      {
        email: dto.email,
        token,
      } as IForgotPasswordEmailJob,
      { attempts: 3, backoff: { type: 'exponential', delay: 60000 } },
    );

    return plainToInstance(ForgotPasswordResDto, {
      redirect: 'http://localhost:3000/v1/auth/reset-password?token=' + token,
    });
  }

  //? USER SECTION
  async signIn(dto: LoginReqDto): Promise<LoginResDto> {
    const { email, password } = dto;
    console.log({ email });
    console.log(await this.userRepository.count());
    const user = await this.userRepository.findOne({
      where: { email },
    });

    const all = await this.userRepository.find({
      select: ['id', 'email'],
    });
    console.log(all);

    console.log(user);

    const isPasswordValid =
      user && (await verifyPassword(password, user.password));

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session = new SessionEntity({
      hash,
      userId: user.id,
      createdBy: SYSTEM_USER_ID,
      updatedBy: SYSTEM_USER_ID,
      userType: ESessionUserType.USER,
    });
    await session.save();

    const token = await this.createToken({
      id: user.id,
      sessionId: session.id,
      hash,
    });

    console.log(token);

    return plainToInstance(LoginResDto, {
      userId: user.id,
      ...token,
    });
  }

  async signUp(dto: RegisterReqDto): Promise<RegisterResDto> {
    // Check if the user already exists
    const isExistUser = await AdminUserEntity.exists({
      where: { email: dto.email },
    });

    if (isExistUser) {
      throw new ValidationException(ErrorCode.E003);
    }

    // Register user
    const user = new UserEntity({
      email: dto.email,
      password: dto.password,
      createdBy: SYSTEM_USER_ID,
      updatedBy: SYSTEM_USER_ID,
    });

    await user.save();

    // Send email verification
    const token = await this.createVerificationToken({ id: user.id });
    const tokenExpiresIn = this.configService.getOrThrow(
      'auth.confirmEmailExpires',
      {
        infer: true,
      },
    );
    await this.cacheManager.set(
      createCacheKey(CacheKey.EMAIL_VERIFICATION, user.id),
      token,
      ms(tokenExpiresIn),
    );
    await this.emailQueue.add(
      JobName.EMAIL_VERIFICATION,
      {
        email: dto.email,
        token,
      } as IVerifyEmailJob,
      { attempts: 3, backoff: { type: 'exponential', delay: 60000 } },
    );

    return plainToInstance(RegisterResDto, {
      userId: user.id,
    });
  }

  async logout(userToken: JwtPayloadType): Promise<void> {
    await this.cacheManager.store.set<boolean>(
      createCacheKey(CacheKey.SESSION_BLACKLIST, userToken.sessionId),
      true,
      userToken.exp * 1000 - Date.now(),
    );
    await SessionEntity.delete(userToken.sessionId);
  }

  async refreshToken(dto: RefreshReqDto): Promise<RefreshResDto> {
    const { sessionId, hash } = this.verifyRefreshToken(dto.refreshToken);
    const session = await SessionEntity.findOneBy({ id: sessionId });

    if (!session || session.hash !== hash) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOneOrFail({
      where: { id: session.userId },
      select: ['id'],
    });

    const newHash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    SessionEntity.update(session.id, { hash: newHash });

    return await this.createToken({
      id: user.id,
      sessionId: session.id,
      hash: newHash,
    });
  }

  async verifyAccessToken(token: string): Promise<JwtPayloadType> {
    let payload: JwtPayloadType;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('auth.secret', { infer: true }),
      });
    } catch {
      throw new UnauthorizedException();
    }

    // Force logout if the session is in the blacklist
    const isSessionBlacklisted = await this.cacheManager.store.get<boolean>(
      createCacheKey(CacheKey.SESSION_BLACKLIST, payload.sessionId),
    );

    if (isSessionBlacklisted) {
      throw new UnauthorizedException();
    }

    return payload;
  }

  //* UTILS FUNCTION
  private verifyRefreshToken(token: string): JwtRefreshPayloadType {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('auth.refreshSecret', {
          infer: true,
        }),
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  private async createVerificationToken(data: { id: string }): Promise<string> {
    return await this.jwtService.signAsync(
      {
        id: data.id,
      },
      {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('auth.confirmEmailExpires', {
          infer: true,
        }),
      },
    );
  }
  private async createForgotToken(data: { id: string }): Promise<string> {
    return await this.jwtService.signAsync(
      {
        id: data.id,
      },
      {
        secret: this.configService.getOrThrow('auth.forgotPasswordSecret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('auth.forgotPasswordExpires', {
          infer: true,
        }),
      },
    );
  }

  private async createToken(data: {
    id: string;
    sessionId: string;
    hash: string;
    role?: RoleEntity;
  }): Promise<Token> {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });
    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role, // TODO: add role
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
      tokenExpires,
    } as Token;
  }

  private verifyVerificationToken(token: string): JwtForgotPasswordPayload {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }
}
