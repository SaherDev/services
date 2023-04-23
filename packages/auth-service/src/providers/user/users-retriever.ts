import { IUser } from '@/models';
import { IUserRepository } from './user.repository.interface';
import { IUsersRetriever } from './users-retriever.interface';
import { Inject, Injectable } from '@nestjs/common';
import { USERS_REPOSITORY } from '../dependency-names';

@Injectable()
export class UsersRetriever implements IUsersRetriever {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  async findUser(userName: string): Promise<IUser> {
    let response: IUser;
    let error: any;

    try {
      response = await this.userRepository.findOne({
        filter: { userName },
      });
    } catch (err) {
      error = err;
    }

    if (error) {
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
      response = await this.userRepository.store(value);
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
