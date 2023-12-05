import {
  IRefreshToken,
  ISessionCookieValue,
  IUserSession,
} from '@services/models';

export interface ISessionDecoder {
  generateSession(user: IUserSession): Promise<boolean>;
  decodeSession(): Promise<ISessionCookieValue>;
  decodeRefreshToken(): Promise<IRefreshToken>;
}
