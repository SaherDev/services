import { IRole } from '@/models';

export interface IRolesRetriever {
  findRole(id: Readonly<string>): Promise<IRole>;
  storeRole(value: IRole): Promise<IRole>;
}
