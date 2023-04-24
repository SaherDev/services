import { ConfigService } from '@nestjs/config';
import { ISessionDecoder } from './session-parser.interface';
import {
  IUserSession,
  TokenType,
  SessionCookieValue,
  ISessionCookieValue,
  IAccessToken,
  IRefreshToken,
  IRefreshTokenPayload,
} from '@services/models';
import { Inject, Injectable } from '@nestjs/common';
import { JWT_DECODER, SESSION_PROVIDER } from '../dependency-names';
import { IJwtDecoder } from '../jwt';
import { SessionProvider } from './session.provider';

@Injectable()
export class SessionDecoder implements ISessionDecoder {
  private sessionKeyPrefix: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(JWT_DECODER) private readonly jwtDecoder: IJwtDecoder,
    @Inject(SESSION_PROVIDER) private readonly sessionProvider: SessionProvider
  ) {
    this.generateConfigs();
  }

  async decodeSession(): Promise<ISessionCookieValue> {
    const session: ISessionCookieValue = this.sessionProvider.get(
      this.sessionKeyPrefix
    );

    if (!session) throw new Error('session missing');

    let decodeAccessToken: IAccessToken;
    try {
      decodeAccessToken = await this.jwtDecoder.verify<IAccessToken>(
        session.accessToken,
        TokenType.AccessToken
      );
    } catch (error) {}

    let decodeRefreshToken: IRefreshToken;
    try {
      decodeRefreshToken = await this.jwtDecoder.verify<IRefreshToken>(
        session.refreshToken,
        TokenType.RefreshToken
      );
    } catch (error) {}

    if (
      !decodeAccessToken ||
      !decodeAccessToken.object.id ||
      !decodeRefreshToken ||
      !decodeRefreshToken.object.id
    )
      throw new Error('parsing failed');

    return new SessionCookieValue(
      this.sessionKeyPrefix,
      true,
      decodeAccessToken,
      decodeRefreshToken
    );
  }
  async generateSession(user: IUserSession): Promise<boolean> {
    let accessToken: string = await this.jwtDecoder.sign(
      user,
      TokenType.AccessToken
    );

    const refreshTokenPayload: IRefreshTokenPayload = {
      id: user.id,
      version: 1,
    };
    let refreshToken: string = await this.jwtDecoder.sign(
      refreshTokenPayload,
      TokenType.RefreshToken
    );

    const sessionValue = new SessionCookieValue(
      this.sessionKeyPrefix,
      false,
      accessToken,
      refreshToken
    );

    this.sessionProvider.set(this.sessionKeyPrefix, sessionValue);

    return true;
  }

  private generateConfigs() {
    this.sessionKeyPrefix = this.configService.get<string>(
      'common.auth.sessionKeyPrefix'
    );
  }
}
