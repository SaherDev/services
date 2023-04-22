import { DynamicModule, Module } from '@nestjs/common';

@Module({})
export class AuthModule {
  static forRoot(): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        {
          provide: AuthModule,
          useClass: AuthModule,
        },
      ],
      exports: [AuthModule],
    };
  }
}
