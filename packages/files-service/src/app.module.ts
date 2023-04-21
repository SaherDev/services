import {
  ENV_CONFIG_FILE_PATH,
  configValidationSchema,
  configurationYaml,
} from '@/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FileUploadModule } from '@/file-upload';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [
        () => {
          return configurationYaml(`${ENV_CONFIG_FILE_PATH}`);
        },
      ],
      validationSchema: configValidationSchema,
    }),
    FileUploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
