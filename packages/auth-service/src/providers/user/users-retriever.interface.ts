import { IUser } from '@/models';

export interface IUsersRetriever {
  findUser(id: Readonly<string>): Promise<IUser>;
  storeUser(value: IUser): Promise<IUser>;
}
