import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileDto, MoveFileFileDto } from './dto';
import { FileUploadService } from './file-upload.service';
import { Serialize } from '@services/common';
@ApiTags('upload')
@Controller('upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Get('file/:id')
  getFile(@Param('id') fileId: string): Promise<any> {
    return this.fileUploadService.getFile(fileId);
  }

  @Post('move-file')
  @Serialize(FileDto)
  //ONLY WITH @EXPOSE()
  async uploadFileToPath(
    @Body() moveFileDto: MoveFileFileDto
  ): Promise<FileDto> {
    return { filePath: 'newPath', fileId: 'file-id' };
  }

  @Post('file')
  async uploadFile(): Promise<void> {
    return this.fileUploadService.uploadFile();
  }
}
