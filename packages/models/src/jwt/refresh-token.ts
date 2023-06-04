import { IRefreshToken, IRefreshTokenPayload } from './refresh-token.interface';

export class RefreshToken implements IRefreshToken {
  constructor(
    public object: IRefreshTokenPayload,
    public iat: number,
    public exp: number,
    public sub: string
  ) {}
}
