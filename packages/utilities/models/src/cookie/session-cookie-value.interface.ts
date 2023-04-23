import { IAccessToken, IRefreshToken } from '@/jwt';

export interface ISessionCookieValue {
  key: string;
  decoded: boolean;
  accessToken: IRefreshToken;
  refreshToken: IAccessToken;
}
