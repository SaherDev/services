import { IsArray, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsArray()
  @ApiProperty()
  permissions: string[];
}
