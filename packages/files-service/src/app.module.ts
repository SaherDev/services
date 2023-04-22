import { AuthModule, YamlConfigModule } from '@services/common';
import {
  ENV_COMMON_CONFIG_FILE_PATH,
  ENV_CONFIG_FILE_PATH,
  configValidationSchema,
} from '@/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileUploadModule } from '@/file-upload';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    YamlConfigModule.forRoot({
      configPaths: [ENV_CONFIG_FILE_PATH, ENV_COMMON_CONFIG_FILE_PATH],
      validatingSchema: configValidationSchema,
      options: {
        isGlobal: true,
        cache: true,
      },
    }),
    AuthModule.forRoot(),
    FileUploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
