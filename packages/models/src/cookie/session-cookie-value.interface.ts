import { IAccessToken, IRefreshToken } from '@/jwt';

export interface ISessionCookieValue {
  key: string;
  decoded: boolean;
  accessToken: IRefreshToken | string;
  refreshToken: IAccessToken | string;
  test?: string;
}
