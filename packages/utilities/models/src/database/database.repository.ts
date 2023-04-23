import { IDatabaseQuey } from './database.query';

export interface IDatabaseRepository<T> {
  findOne(value: IDatabaseQuey<T>): Promise<T>;
  store(value: T): Promise<T>;
  updateOne(query: IDatabaseQuey<T>, value: Partial<T>): Promise<T>;
}
