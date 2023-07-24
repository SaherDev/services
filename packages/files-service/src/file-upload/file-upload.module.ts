import { FILES_RETRIEVER, FilesRetriever } from '@/providers';
import {
  IStorage,
  IStoragePresigner,
  S3,
  STORAGE,
  STORAGE_PRESIGNER,
} from '@services/utilities-storage';

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
  ],
})
export class FileUploadModule {}
