import { IUserSession } from './user-session.interface';

export class UserSession implements IUserSession {
  constructor(
    public id: string,
    public name: string,
    public permissions: string[]
  ) {}
}
