import { AllConfigType } from '@/config/config.type';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'user-jwt') {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly cache: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('auth.userSecret', { infer: true }),
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

    return payload; // request.user
  }
}
