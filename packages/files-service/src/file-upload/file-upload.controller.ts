import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MoveFileFileDto } from './dto';
import { FileUploadService } from './file-upload.service';

@ApiTags('upload')
@Controller('upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Get('file/:id')
  getFile(@Param('id') fileId: string): Promise<any> {
    return this.fileUploadService.getFile(fileId);
  }

  @Post('move-file')
  async uploadFileToPath(
    @Body() moveFileDto: MoveFileFileDto
  ): Promise<boolean> {
    return true;
  }

  @Post('file')
  async uploadFile(): Promise<void> {
    return this.fileUploadService.uploadFile();
  }
}
