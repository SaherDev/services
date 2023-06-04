import { IJwtToken } from './jwt-token.interface';

export interface IRefreshTokenPayload {
  id: string;
  version: number;
}

export interface IRefreshToken extends IJwtToken<IRefreshTokenPayload> {}
