import { IUser } from '@/models';

export interface IUsersRetriever {
  findUser(userName: Readonly<string>): Promise<IUser>;
  storeUser(value: IUser): Promise<IUser>;
}
