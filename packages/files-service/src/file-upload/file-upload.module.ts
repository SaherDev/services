import { GoogleDrive, S3, STORAGE } from '@services/utilities-storage';
import { QUEUE, Sqs } from '@services/utilities-queue';

import { FILES_RETRIEVER } from '@/config';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { FilesRetriever } from '@/providers';
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
  ],
})
export class FileUploadModule {}
