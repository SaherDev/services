import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  JWT_DECODER,
  JwtDecoder,
  SESSION_DECODER,
  SESSION_PROVIDER,
  SessionDecoder,
  SessionProvider,
} from '../providers';

import { JwtService } from '@nestjs/jwt';

@Module({})
@Global()
export class CommonAuthModule {
  static forRoot(): DynamicModule {
    return {
      module: CommonAuthModule,
      providers: [
        {
          provide: CommonAuthModule,
          useClass: CommonAuthModule,
        },
        {
          provide: SESSION_DECODER,
          useClass: SessionDecoder,
        },
        {
          provide: JWT_DECODER,
          useClass: JwtDecoder,
        },
        {
          provide: SESSION_PROVIDER,
          useClass: SessionProvider,
        },
        JwtService,
      ],
      exports: [CommonAuthModule],
    };
  }
}
