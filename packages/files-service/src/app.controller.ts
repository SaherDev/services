import { Controller, Get, Param, Redirect } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect()
  rootRequest() {
    return { url: 'ProductionUrl' };
  }

  @Get('file/:id')
  getMainFile(@Param('id') fileId: string) {
    return this.appService.getFile(fileId);
  }
}
