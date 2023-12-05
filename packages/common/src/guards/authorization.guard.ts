import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IUserSession } from '@services/models';
import { isArraySubset } from '../providers';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(@Inject('Reflector') private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions =
      this.reflector.get<any[]>('permissions', context.getHandler()) || [];

    if (!permissions.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userSession: IUserSession = request['userSession'];

    return this.validateOrThrow(userSession, permissions);
  }

  private validateOrThrow(
    userSession: IUserSession,
    permissions: string[]
  ): boolean {
    if (!userSession || !userSession.id || !userSession.permissions)
      throw new ForbiddenException('forbidden');

    const isAllPermissionsFound: boolean = isArraySubset(
      permissions,
      userSession.permissions
    );
    if (!isAllPermissionsFound) throw new ForbiddenException('forbidden');

    return true;
  }
}
