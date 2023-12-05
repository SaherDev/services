import { IDatabaseRepository } from '@services/models';
import { IUser } from '@/models';

export interface IUserRepository extends IDatabaseRepository<IUser> {}
