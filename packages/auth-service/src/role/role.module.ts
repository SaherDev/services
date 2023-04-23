import { MongoRole, RoleSchema } from '@/models';
import {
  ROLES_REPOSITORY,
  ROLES_RETRIEVER,
  RolesRepository,
  RolesRetriever,
} from '@/providers';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongoRole.name,
        schema: RoleSchema,
      },
    ]),
  ],

  controllers: [RoleController],
  providers: [
    {
      provide: ROLES_RETRIEVER,
      useClass: RolesRetriever,
    },
    {
      provide: ROLES_REPOSITORY,
      useClass: RolesRepository,
    },
    RoleService,
  ],
  exports: [RoleService],
})
export class RoleModule {}
