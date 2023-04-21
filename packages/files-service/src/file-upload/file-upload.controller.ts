import { Controller, Get, Param, Post } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';

@Controller('upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Get('file/:id')
  getFile(@Param('id') fileId: string) {
    return this.fileUploadService.getFile(fileId);
  }

  @Post('file')
  uploadFile() {
    return this.fileUploadService.uploadFile();
  }
}
