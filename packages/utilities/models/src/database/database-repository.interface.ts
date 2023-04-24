import { IDatabaseFindManyQuey } from './database-find-many-query.type';
import { IDatabaseQuey } from './database-query.interface';

export interface IDatabaseRepository<T> {
  findOne(value: IDatabaseQuey<T>): Promise<T>;
  findMany(value: IDatabaseFindManyQuey<T>): Promise<T[]>;
  store(value: T): Promise<T>;
  updateOne(query: IDatabaseQuey<T>, value: Partial<T>): Promise<T>;
}
