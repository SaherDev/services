import { IUser } from '@/models';
import { IUserRepository } from './user.repository.interface';
import { IUsersRetriever } from './users-retriever.interface';

export class UsersRetriever implements IUsersRetriever {
  constructor(private readonly rolesRepository: IUserRepository) {}

  async findUser(id: string): Promise<IUser> {
    let response: IUser;
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
  async storeUser(value: IUser): Promise<IUser> {
    let response: IUser;
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
