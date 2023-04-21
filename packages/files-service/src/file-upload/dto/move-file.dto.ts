import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class MoveFileFileDto {
  @ApiProperty()
  @IsString()
  fileId: string;

  @ApiProperty()
  @IsString()
  filePath: string;
}
