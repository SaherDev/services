import { IJwtToken } from './jwt-token.interface';
import { IUserSession } from '@/user';

export interface IAccessToken extends IJwtToken<IUserSession> {}
