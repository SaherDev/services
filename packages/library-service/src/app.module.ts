import { CommonAuthModule, YamlConfigModule } from '@services/common';
import {
  ENV_COMMON_CONFIG_FILE_PATH,
  ENV_LIBRARY_SERVICE_FILE_PATH,
  configValidationSchema,
} from '@/config';
import { Global, Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LibraryModule } from './library-components/library.module';
import { join } from 'path';

@Global()
@Module({
  imports: [
    YamlConfigModule.forRoot({
      configPaths: [
        ENV_COMMON_CONFIG_FILE_PATH,
        ENV_LIBRARY_SERVICE_FILE_PATH,
        join(__dirname, '../src/config/global.config.yaml'),
      ],
      validatingSchema: configValidationSchema,
      options: {
        isGlobal: true,
        cache: true,
      },
    }),
    CommonAuthModule.forRoot(),
    LibraryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
