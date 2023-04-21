import { Controller, Get, Redirect } from '@nestjs/common';

import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService
  ) {}

  @Get()
  @Redirect()
  rootRequest() {
    return { url: this.configService.get('defaults.url.productionUrl') };
  }
}
