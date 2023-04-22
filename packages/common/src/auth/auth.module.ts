import { DynamicModule, Module } from '@nestjs/common';

@Module({})
export class CommonAuthModule {
  static forRoot(): DynamicModule {
    return {
      module: CommonAuthModule,
      providers: [
        {
          provide: CommonAuthModule,
          useClass: CommonAuthModule,
        },
      ],
      exports: [CommonAuthModule],
    };
  }
}
