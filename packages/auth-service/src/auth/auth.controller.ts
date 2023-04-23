import { Body, Controller, Post } from '@nestjs/common';

import { Serialize } from '@services/common';
import { AuthService } from './auth.service';
import { CreateUserDto, UserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Serialize(UserDto)
  signUp(@Body() user: CreateUserDto) {
    return this.authService.signUp(
      user.userName,
      user.password,
      user.firstName,
      user.lastName
    );
  }

  @Post('log-in')
  @Serialize(UserDto)
  logIn() {}
}
