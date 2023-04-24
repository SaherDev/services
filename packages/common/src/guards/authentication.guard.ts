import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import {
  IAccessToken,
  ISessionCookieValue,
  UserSession,
} from '@services/models';
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

    const accessToken = decodedSession.accessToken as IAccessToken;

    if (!accessToken || !accessToken.object)
      throw new UnauthorizedException('unauthorized');

    const userSession: UserSession = accessToken.object;

    if (!userSession || !userSession.id)
      throw new UnauthorizedException('unauthorized');

    const request = context.switchToHttp().getRequest();
    request['userSession'] = userSession;
    return true;
  }
}
