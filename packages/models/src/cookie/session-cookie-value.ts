import { IAccessToken, IRefreshToken } from '@/jwt';

import { ISessionCookieValue } from './session-cookie-value.interface';

export class SessionCookieValue implements ISessionCookieValue {
  constructor(
    public key: string,
    public decoded: boolean,
    public accessToken: IRefreshToken,
    public refreshToken: IAccessToken
  ) {}
}
