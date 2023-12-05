import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class CreateUserDto {
  @IsString()
  @ApiProperty()
  firstName: string;

  @IsString()
  @ApiProperty()
  lastName: string;

  @IsString()
  @ApiProperty()
  userName: string;

  @IsString()
  @ApiProperty()
  password: string;
}
