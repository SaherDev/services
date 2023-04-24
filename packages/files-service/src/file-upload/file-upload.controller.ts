import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileDto, MoveFileFileDto } from './dto';
import { FileUploadService } from './file-upload.service';
import { FormData, FormDatGuard, Serialize, IFormData } from '@services/common';

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
  //TODO:MOVE DECO
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
        info: { type: 'string' },
      },
    },
  })
  @UseGuards(FormDatGuard)
  async uploadFile(@FormData() form: IFormData): Promise<string> {
    return this.fileUploadService.uploadFile(form);
  }
}
