import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    // const someConfigValue = this.configService.get<string>(
    //   'common.auth.someKey'
    // );

    return true;
  }
}
