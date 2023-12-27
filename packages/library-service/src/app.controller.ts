import { Controller, Get, Redirect } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @Redirect()
  rootRequest() {
    return { url: this.configService.get('defaults.url.productionUrl') };
  }
}
