import {
  FILES_RETRIEVER,
  FilesRetriever,
  MESSAGES_RETRIEVER,
} from '@/providers';
import { QUEUE, Sqs } from '@services/utilities-queue';
import { S3, STORAGE } from '@services/utilities-storage';

import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { MessagesRetriever } from './../providers/messages-retriever/message-retriever';
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
    // {
    //   provide: STORAGE,
    //   useClass: GoogleDrive,
    // },
    {
      provide: QUEUE,
      useClass: Sqs,
    },

    {
      provide: MESSAGES_RETRIEVER,
      useClass: MessagesRetriever,
    },
  ],
})
export class FileUploadModule {}
