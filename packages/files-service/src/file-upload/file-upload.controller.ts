import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileDto, MoveFileFileDto, pullDataDto } from './dto';
import { FileUploadService } from './file-upload.service';
import {
  FormData,
  FormDataGuard,
  Serialize,
  IFormData,
  ApiMultipartFormData,
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

  @Post('pull-data')
  @HttpCode(HttpStatus.OK)
  async pullData(@Body() pullDataDto: pullDataDto): Promise<FileDto> {
    return this.fileUploadService.pullData(
      pullDataDto.schemasLocationId,
      pullDataDto.schemaName
    );
  }

  @Post('file')
  @UseGuards(FormDataGuard)
  @ApiMultipartFormData({
    hello: { type: 'string' },
  })
  async uploadFile(@FormData() form: IFormData): Promise<string> {
    return this.fileUploadService.uploadFile(form);
  }
}
