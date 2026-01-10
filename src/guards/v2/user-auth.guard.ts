import { IS_PUBLIC } from '@/constants/app.constant';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class UserAuthGuard extends AuthGuard('user-jwt') {
  constructor(
    private readonly cls: ClsService,
    private reflector: Reflector,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    if (err || !user) {
      throw err || info;
    }

    const req = context.switchToHttp().getRequest();
    req.user = user;

    this.cls.set('userId', user.id);
    this.cls.set('userType', 'user');

    return user;
  }
}
