import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class MoveFileFileDto {
  @ApiProperty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsString()
  newPath: string;
}
