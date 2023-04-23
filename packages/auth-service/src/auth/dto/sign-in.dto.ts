import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class SignInDto {
  @IsString()
  @ApiProperty()
  userName: string;

  @IsString()
  @ApiProperty()
  password: string;
}
