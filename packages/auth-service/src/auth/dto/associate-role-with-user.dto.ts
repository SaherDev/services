import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class associateRoleWithUserDto {
  @IsArray()
  @ApiProperty()
  roles: string[];
}
