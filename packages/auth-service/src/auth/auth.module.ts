import { MongoRole, MongoUser, RoleSchema, UserSchema } from '@/models';
import {
  PASSWORD_HASHER,
  PasswordHasher,
  ROLES_REPOSITORY,
  ROLES_RETRIEVER,
  RolesRepository,
  RolesRetriever,
  USERS_REPOSITORY,
  USERS_RETRIEVER,
  UserRepository,
  UsersRetriever,
} from '@/providers';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongoUser.name,
        schema: UserSchema,
      },
      {
        name: MongoRole.name,
        schema: RoleSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: USERS_RETRIEVER,
      useClass: UsersRetriever,
    },
    {
      provide: ROLES_RETRIEVER,
      useClass: RolesRetriever,
    },
    {
      provide: USERS_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: ROLES_REPOSITORY,
      useClass: RolesRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: PasswordHasher,
    },
    AuthService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
