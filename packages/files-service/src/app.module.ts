import { S3, STORAGE } from '@services/utilities-storage';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FILES_RETRIEVER } from '@/config';
import { FilesRetriever } from '@/providers';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: STORAGE,
      useClass: S3,
    },
    {
      provide: FILES_RETRIEVER,
      useClass: FilesRetriever,
    },
  ],
})
export class AppModule {}
