import { ROLES_REPOSITORY } from '../dependency-names/dependency-names';
import { IRole } from '@/models';
import { IRolesRepository } from './roles.repository.interface';
import { IRolesRetriever } from './roles-retriever.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RolesRetriever implements IRolesRetriever {
  constructor(
    @Inject(ROLES_REPOSITORY) private readonly rolesRepository: IRolesRepository
  ) {}

  async findRole(value: Partial<IRole>): Promise<IRole> {
    let response: IRole;
    let error: any;

    try {
      response = await this.rolesRepository.findOne({
        filter: value,
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

  async updateOne(
    query: Partial<IRole>,
    value: Partial<IRole>
  ): Promise<IRole> {
    let response: IRole;
    let error: any;

    try {
      if (value.id) delete value.id;

      response = await this.rolesRepository.updateOne(
        {
          filter: query,
        },
        value
      );
    } catch (err) {
      error = err;
    }

    if (!response || error) {
      throw new Error(
        `updateOne >> updating role failed >> error = ${JSON.stringify(error)}`
      );
    }

    return response;
  }
}
