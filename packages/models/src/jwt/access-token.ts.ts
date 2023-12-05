import { IAccessToken } from './access-token.interface';
import { IUserSession } from '@/user';

export class AccessToken implements IAccessToken {
  constructor(
    public object: IUserSession,
    public iat: number,
    public exp: number,
    public sub: string
  ) {}
}
