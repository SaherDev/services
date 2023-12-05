import { IRole } from '@/models';

export interface IRolesRetriever {
  findRole(value: Partial<IRole>): Promise<IRole>;
  storeRole(value: IRole): Promise<IRole>;
  updateOne(query: Partial<IRole>, value: Partial<IRole>): Promise<IRole>;
  findRoles(ides: string[]): Promise<IRole[]>;
}
