import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { ISessionCookieValue } from '@services/models';
import { FastifyRequest } from 'fastify';
import { ISessionDecoder, SESSION_DECODER } from '../providers';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    @Inject(SESSION_DECODER) private readonly sessionDecoder: ISessionDecoder
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let decodedSession: ISessionCookieValue;
    let error: any;
    try {
      decodedSession = await this.sessionDecoder.decodeSession();
    } catch (err) {
      error = err;
    }

    if (
      error ||
      !decodedSession ||
      !decodedSession.decoded ||
      !decodedSession.accessToken ||
      !decodedSession.refreshToken
    )
      throw new UnauthorizedException('unauthorized');

    return true;
  }
}
