import { IRole, IUser } from '@/models';
import {
  IPasswordHasher,
  IRolesRetriever,
  IUsersRetriever,
  PASSWORD_HASHER,
  ROLES_RETRIEVER,
  USERS_RETRIEVER,
} from '@/providers';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SESSION_DECODER, uuid, ISessionDecoder } from '@services/common';
import { UserSession } from '@services/models';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(USERS_RETRIEVER) private readonly usersRetriever: IUsersRetriever,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: IPasswordHasher,
    @Inject(SESSION_DECODER) private readonly sessionDecoder: ISessionDecoder,
    @Inject(ROLES_RETRIEVER) private readonly rolesRetriever: IRolesRetriever
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

  async updateUser(
    userName: Readonly<string>,
    user: Partial<IUser>
  ): Promise<any> {
    if (!userName || !user) {
      this.logger.error(
        `updateUser >> fields missing, aborting >> userName  = ${userName}, user = ${user} `
      );
      throw new BadRequestException('fields missing');
    }

    let existingUserResponse: IUser;
    let existingUserResponseError: any = null;

    try {
      existingUserResponse = await this.findUser(userName);
    } catch (error) {
      existingUserResponseError = error;
    }

    if (existingUserResponseError) {
      this.logger.error(
        `updateUser >> retrieving existing user failed, aborting. error = ${JSON.stringify(
          existingUserResponseError
        )} `
      );
      throw new InternalServerErrorException('updating eUser up failed');
    }

    if (!existingUserResponse || !existingUserResponse.id) {
      throw new NotFoundException('user not found');
    }

    let updatedUserResponse: IUser;
    let updatedUserResponseError: any = null;

    try {
      user.roles.push(...existingUserResponse.roles);
      updatedUserResponse = await this.usersRetriever.updateOne(
        { id: existingUserResponse.id },
        user
      );
    } catch (error) {
      updatedUserResponseError = error;
    }

    if (!updatedUserResponse || updatedUserResponseError) {
      this.logger.error(
        `updateUser >> updating the user failed, aborting. error = ${JSON.stringify(
          existingUserResponseError
        )} `
      );
      throw new InternalServerErrorException('updating the user failed');
    }

    return updatedUserResponse;
  }

  async signIn(
    userName: Readonly<string>,
    password: Readonly<string>
  ): Promise<IUser> {
    if (!userName || !password) {
      this.logger.error(
        `validateUser >> fields missing, aborting >> userName  = ${userName}, password = ${password} `
      );
      throw new BadRequestException('fields missing');
    }

    let existingUserResponse: IUser;
    let existingUserResponseError: any = null;

    try {
      existingUserResponse = await this.findUser(userName);
    } catch (error) {
      existingUserResponseError = error;
    }

    if (existingUserResponseError) {
      this.logger.error(
        `signIn >> retrieving existing user failed, aborting. error = ${JSON.stringify(
          existingUserResponseError
        )} `
      );
      throw new InternalServerErrorException('sign up failed');
    }

    if (!existingUserResponse) {
      throw new NotFoundException('user not found');
    }

    const verifyPassword: boolean = await this.passwordHasher.verifyPassword(
      password,
      existingUserResponse.password
    );

    if (!verifyPassword) throw new BadRequestException('bad password');

    const sessionSetResponse: boolean = await this.generateUserSession(
      existingUserResponse
    );

    if (!sessionSetResponse) {
      this.logger.warn('signIn >> failed to set session, skipping');
    }

    return existingUserResponse;
  }

  private async findUser(userName: Readonly<string>): Promise<IUser> {
    return await this.usersRetriever.findUser(userName);
  }

  private async generateUserSession(user: Readonly<IUser>): Promise<boolean> {
    const permissions = await this.prepareUserPermission(user);
    const fullName: string = `${user.firstName} ${user.lastName}`;
    return await this.sessionDecoder.generateSession(
      new UserSession(user.id, fullName, permissions)
    );
  }

  private async prepareUserPermission(
    user: Readonly<IUser>
  ): Promise<string[]> {
    if (!user.roles || !user.roles.length) return [];

    let response: IRole[];
    let error: any;

    try {
      response = await this.rolesRetriever.findRoles(user.roles);
    } catch (err) {
      error = err;
    }

    if (!response || error) {
      this.logger.warn(
        `prepareUserPermission >> failed to retrieve roles, skipping >>  error = ${JSON.stringify(
          error
        )}`
      );
    }

    return [...new Set(response.map((role) => role.permissions).flat())];
  }

  private validateUserFields(
    userName: Readonly<string>,
    password: Readonly<string>,
    firstName: Readonly<string>,
    lastName: Readonly<string>
  ) {
    if (!userName || !password || !firstName || !lastName) {
      this.logger.error(
        `validateUser >> fields missing, aborting >> userName  = ${userName}, password = ${password}, firstName = ${firstName}, lastName = ${lastName}`
      );
      throw new BadRequestException('fields missing');
    }
    return true;
  }
}
