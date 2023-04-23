import { IUser } from '@/models';
import {
  IPasswordHasher,
  IUsersRetriever,
  PASSWORD_HASHER,
  USERS_RETRIEVER,
} from '@/providers';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { uuid } from '@services/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(USERS_RETRIEVER) private readonly usersRetriever: IUsersRetriever,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: IPasswordHasher
  ) {}

  async signUp(
    userName: Readonly<string>,
    password: Readonly<string>,
    firstName: Readonly<string>,
    lastName: Readonly<string>
  ): Promise<IUser> {
    this.validateUserFields(userName, password, firstName, lastName);

    let existingUserResponse: IUser;
    let existingUserResponseError: any = null;

    try {
      existingUserResponse = await this.findUser(userName);
    } catch (error) {
      existingUserResponseError = error;
    }

    if (existingUserResponseError) {
      this.logger.error(
        `signUp >> retrieving existing user failed, aborting. error = ${JSON.stringify(
          existingUserResponseError
        )} `
      );
      throw new InternalServerErrorException('sign up failed');
    }

    if (existingUserResponse && existingUserResponse.userName) {
      throw new BadRequestException('this username already in use');
    }

    let createUserResponse: IUser;
    let createUserError: any = null;
    try {
      const userId: string = uuid();
      const hashedPassword = await this.passwordHasher.hashPasWord(password);

      createUserResponse = await this.usersRetriever.storeUser({
        id: userId,
        userName,
        password: hashedPassword,
        firstName,
        lastName,
        isActive: true,
      });
    } catch (error) {
      createUserError = error;
    }

    if (!createUserResponse || createUserError) {
      this.logger.error(
        `signUp >> saving the user failed  , aborting >> error = ${createUserError}`
      );
      throw new InternalServerErrorException('sign up failed');
    }

    return createUserResponse;
  }

  async logIn(): Promise<any> {}

  private async findUser(userName: Readonly<string>): Promise<IUser> {
    return await this.usersRetriever.findUser(userName);
  }

  private validateUserFields(
    userName: Readonly<string>,
    password: Readonly<string>,
    firstName: Readonly<string>,
    lastName: Readonly<string>
  ) {
    if (!userName || !password || !firstName || !lastName) {
      this.logger.error(
        `validateUser >> fields missing, aborting >> userName  = ${userName}, password = ${password} firstName = ${firstName} lastName = ${lastName}`
      );
      throw new BadRequestException('fields missing');
    }
    return true;
  }
}
