import { AdminUserEntity } from '@/api/admin-user/entities/admin-user.entity';
import { IS_PUBLIC } from '@/constants/app.constant';
import {
  CHECK_POLICIES_KEY,
  PolicyHandler,
} from '@/decorators/policies.decorator';
import { CaslAbilityFactory } from '@/libs/casl/ability.factory';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslFactory: CaslAbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const handlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const request = context
      .switchToHttp()
      .getRequest<Request & { user: AdminUserEntity }>();
    const user = request.user;

    const ability = this.caslFactory.createForUser(user);

    return handlers.every((handler) => handler(ability));
  }
}
