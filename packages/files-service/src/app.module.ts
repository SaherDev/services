import { configValidationSchema, configurationYaml } from '@/config';

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
          return configurationYaml(`${process.env.FILES_SERVICE_FILE_PATH}`);
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
