import { IRole } from '@/models';
import { IRolesRepository } from './roles.repository.interface';
import { IRolesRetriever } from './roles-retriever.interface';

export class RolesRetriever implements IRolesRetriever {
  constructor(private readonly rolesRepository: IRolesRepository) {}

  async findRole(id: string): Promise<IRole> {
    let response: IRole;
    let error: any;

    try {
      response = await this.rolesRepository.findOne({
        filter: { id },
      });
    } catch (err) {
      error = err;
    }

    if (!response || error) {
      throw new Error(
        `findRole >> find roles failed >> error = ${JSON.stringify(error)}`
      );
    }

    return response;
  }
  async storeRole(value: IRole): Promise<IRole> {
    let response: IRole;
    let error: any;

    try {
      response = await this.rolesRepository.store(value);
    } catch (err) {
      error = err;
    }

    if (!response || error) {
      throw new Error(
        `findRole >> find roles failed >> error = ${JSON.stringify(error)}`
      );
    }

    return response;
  }
}
