import {
  FILES_RETRIEVER,
  FilesRetriever,
  MESSAGES_RETRIEVER,
  MessagesRetriever,
  THUMBNAILS_GENERATOR,
  ThumbnailsGenerator,
} from '@/providers';
import { FUNCTION, Lambda } from '@services/utilities-functions';
import { QUEUE, Sqs } from '@services/utilities-queue';
import { S3, STORAGE, STORAGE_PRESIGNER } from '@services/utilities-storage';

import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [FileUploadController],
  providers: [
    FileUploadService,
    {
      provide: FILES_RETRIEVER,
      useClass: FilesRetriever,
    },
    {
      provide: STORAGE,
      useClass: S3,
    },
    {
      provide: STORAGE_PRESIGNER,
      useExisting: STORAGE,
    },
    // {
    //   provide: STORAGE,
    //   useClass: GoogleDrive,
    // },
    {
      provide: QUEUE,
      useClass: Sqs,
    },
    { provide: FUNCTION, useClass: Lambda },
    {
      provide: THUMBNAILS_GENERATOR,
      useClass: ThumbnailsGenerator,
    },
    {
      provide: MESSAGES_RETRIEVER,
      useClass: MessagesRetriever,
    },
  ],
})
export class FileUploadModule {}
