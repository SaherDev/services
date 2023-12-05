import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class pullDataDto {
  @ApiProperty()
  @IsString()
  schemasLocationId: string;

  @ApiProperty()
  @IsString()
  schemaName: string;
}
