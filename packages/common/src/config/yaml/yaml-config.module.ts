import { ConfigFactory, ConfigModule } from '@nestjs/config';
import { DynamicModule, Module } from '@nestjs/common';

import { YamlConfigModuleOptions } from './yaml-config-module-options';
import { configurationYaml } from './configuration.yaml';

@Module({})
export class YamlConfigModule {
  static forRoot(config: YamlConfigModuleOptions): DynamicModule {
    const configFactories: ConfigFactory[] = config.configPaths.map(
      (configPath) => {
        return () => {
          return configurationYaml(`${configPath}`);
        };
      }
    );

    return {
      module: YamlConfigModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: config.options.isGlobal,
          cache: config.options.cache,
          load: configFactories,
          validationSchema: config.validatingSchema,
        }),
      ],
    };
  }
}
