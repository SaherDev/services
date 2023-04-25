import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileDto, MoveFileFileDto } from './dto';
import { FileUploadService } from './file-upload.service';
import {
  FormData,
  FormDataGuard,
  Serialize,
  IFormData,
  ApiFileUpload,
} from '@services/common';

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
  async moveFile(@Body() moveFileDto: MoveFileFileDto): Promise<FileDto> {
    return { filePath: 'newPath', fileId: 'file-id' };
  }

  @Post('file')
  @ApiConsumes('multipart/form-data')
  @UseGuards(FormDataGuard)
  @ApiFileUpload()
  async uploadFile(@FormData() form: IFormData): Promise<string> {
    return this.fileUploadService.uploadFile(form);
  }
}
