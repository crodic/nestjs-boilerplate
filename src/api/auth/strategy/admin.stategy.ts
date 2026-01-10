import { AllConfigType } from '@/config/config.type';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    @Inject(CACHE_MANAGER)
    private cache: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<AllConfigType>('auth.secret', {
        infer: true,
      }),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    const isSessionBlacklisted = await this.cache.store.get<boolean>(
      `session_blacklist:${payload.sessionId}`,
    );

    if (isSessionBlacklisted) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
