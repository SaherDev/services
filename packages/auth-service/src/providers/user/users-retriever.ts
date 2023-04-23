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

  async updateOne(
    query: Partial<IUser>,
    value: Partial<IUser>
  ): Promise<IUser> {
    let response: IUser;
    let error: any;

    try {
      if (value.id) delete value.id;

      response = await this.userRepository.updateOne(
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
