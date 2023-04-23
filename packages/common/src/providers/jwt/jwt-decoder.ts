import { ConfigService } from '@nestjs/config';
import { IJwtDecoder } from './jwt-decoder.interface';
import { Injectable } from '@nestjs/common';
import { JwtDecoderConfig } from './jwt-decoder-config';
import { JwtService } from '@nestjs/jwt';
import { TokenType } from '@services/models';

@Injectable()
export class JwtDecoder implements IJwtDecoder {
  private config: JwtDecoderConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {
    this.generateConfigs();
  }

  async sign(payload: any, type: TokenType): Promise<string> {
    const { secret, maxAge } = this.prepareConfigBaseOnType(type);

    let response: any;
    let error: any;

    try {
      response = await this.jwtService.signAsync(payload, {
        secret,
        expiresIn: maxAge,
      });
    } catch (err) {
      error = err;
    }

    if (!response || error) throw new Error('object sign failed');

    return response;
  }

  async verify<T>(token: Readonly<string>, type: TokenType): Promise<T> {
    const { secret, maxAge } = this.prepareConfigBaseOnType(type);

    let response: any;
    let error: any;

    try {
      response = await this.jwtService.verify(token, {
        secret,
        maxAge,
      });
    } catch (err) {
      error = err;
    }

    if (!response || error) throw new Error('token verify failed');

    return response;
  }

  private prepareConfigBaseOnType(type: TokenType) {
    let secret: string;
    let maxAge: number;

    switch (type) {
      case TokenType.AccessToken:
        secret = this.config.accessTokenSecret;
        maxAge = this.config.accessTokenMaxAge;
        break;
      case TokenType.RefreshToken:
        secret = this.config.refreshTokenSecret;
        maxAge = this.config.refreshTokenMaxAge;
        break;
    }

    return { secret, maxAge };
  }

  private generateConfigs() {
    this.config = new JwtDecoderConfig(
      this.configService.get<string>('common.auth.accessTokenSecret'),
      this.configService.get<number>('common.auth.accessTokenMaxAge'),
      this.configService.get<string>('common.auth.refreshTokenSecret'),
      this.configService.get<number>('common.auth.refreshTokenMaxAge')
    );
  }
}
