import { IUser } from '@/models';

export interface IUsersRetriever {
  findUser(value: Partial<IUser>): Promise<IUser>;
  storeUser(value: IUser): Promise<IUser>;
  updateOne(query: Partial<IUser>, value: Partial<IUser>): Promise<IUser>;
}
