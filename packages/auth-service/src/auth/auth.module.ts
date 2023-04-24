import { MongoUser, UserSchema } from '@/models';
import {
  PASSWORD_HASHER,
  PasswordHasher,
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
import { RoleModule } from '@/role';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongoUser.name,
        schema: UserSchema,
      },
    ]),
    RoleModule,
  ],
  providers: [
    {
      provide: USERS_RETRIEVER,
      useClass: UsersRetriever,
    },

    {
      provide: USERS_REPOSITORY,
      useClass: UserRepository,
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
