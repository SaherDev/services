import { IUser } from './user.interface';

export class User implements IUser {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public userName: string,
    public password: string,
    public roles: string[],
    public isActive: boolean
  ) {}
}
