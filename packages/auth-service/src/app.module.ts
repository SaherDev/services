import { CommonAuthModule, YamlConfigModule } from '@services/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ENV_AUTH_SERVICE_CONFIG_FILE_PATH,
  ENV_COMMON_CONFIG_FILE_PATH,
  configValidationSchema,
} from '@/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    YamlConfigModule.forRoot({
      configPaths: [
        ENV_AUTH_SERVICE_CONFIG_FILE_PATH,
        ENV_COMMON_CONFIG_FILE_PATH,
      ],
      validatingSchema: configValidationSchema,
      options: {
        isGlobal: true,
        cache: true,
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('environment.database.mongoConnectionString'),
      }),
      inject: [ConfigService],
    }),
    CommonAuthModule.forRoot(),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
