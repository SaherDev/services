import * as LibraryClasses from '@/models/library-classes-names-space';

import {
  COLLECTIONS_AGGREGATOR,
  ComponentsNodesFactory,
  MongooseAggregator,
} from '@services//collections-aggregator';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Connection } from 'mongoose';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

export const LIBRARY_DB_CONNECTION = 'LIBRARY_DB_CONNECTION';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('environment.database.mongoConnectionString'),
      }),
      inject: [ConfigService],
      connectionName: LIBRARY_DB_CONNECTION,
    }),
  ],
  controllers: [LibraryController],
  providers: [
    LibraryService,
    {
      provide: ComponentsNodesFactory,
      useFactory: (config: ConfigService) =>
        new ComponentsNodesFactory(
          LibraryClasses,
          config.get('environment.database.version')
        ),
      inject: [ConfigService],
    },
    {
      provide: COLLECTIONS_AGGREGATOR,
      useFactory: async (
        componentsNodesFactory: ComponentsNodesFactory,
        connection: Connection
      ) => {
        return new MongooseAggregator(componentsNodesFactory, connection);
      },
      inject: [
        ComponentsNodesFactory,
        getConnectionToken(LIBRARY_DB_CONNECTION),
      ],
    },
  ],
  exports: [],
})
export class LibraryModule {}
