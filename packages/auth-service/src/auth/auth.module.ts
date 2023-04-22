import { Global, Module } from '@nestjs/common';
import { MongoRole, MongoUser, RoleSchema, UserSchema } from '@/models';
import { ROLES_RETRIEVER, USERS_RETRIEVER } from '@/config';
import { RolesRetriever, UsersRetriever } from '@/providers';

import { MongooseModule } from '@nestjs/mongoose';

@Global()
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
  ],
})
export class AppAuthModule {}
