import { ConfigModuleOptions } from '@nestjs/config';

export interface YamlConfigModuleOptions {
  configPaths: Readonly<string[]>;
  validatingSchema: any;
  options?: ConfigModuleOptions;
}
