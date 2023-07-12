import { UserPermission } from '@/models';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  AuthenticationRequired,
  AuthorizationRequired,
  Serialize,
} from '@services/common';
import { AuthService } from './auth.service';
import {
  associateRoleWithUserDto,
  CreateUserDto,
  SignInDto,
  UserDto,
} from './dto';

@Controller('auth')
@ApiTags('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() user: CreateUserDto): Promise<UserDto> {
    return this.authService.signUp(
      user.userName,
      user.password,
      user.firstName,
      user.lastName
    );
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() user: SignInDto): Promise<UserDto> {
    return this.authService.signIn(user.userName, user.password);
  }

  @Post('user/:username/role')
  @AuthenticationRequired()
  @AuthorizationRequired([UserPermission.Update])
  async associateRoleWithUser(
    @Param('username') userName: string,
    @Body() body: associateRoleWithUserDto
  ): Promise<UserDto> {
    return this.authService.updateUser(userName, body);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(): Promise<UserDto> {
    return this.authService.refreshToken();
  }
  // @Post('me')
  // @AuthenticationRequired()
  // async me(@UserSession() user: IUserSession): Promise<any> {
  //   return user;
  // }
}
