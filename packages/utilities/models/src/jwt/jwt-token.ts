import { IJwtToken } from './jwt-token.interface';

export class JWtToken<T> implements IJwtToken<T> {
  constructor(
    public object: T,
    public iat: number,
    public exp: number,
    public sub: string
  ) {}
}
