import { HTTPService, ObjectFieldsAccessor } from '@services/common-helpers';

import { IAdapterRequestConfig } from '@services/models';

export class DataRetriever {
  static async pullData(
    config: Readonly<IAdapterRequestConfig>
  ): Promise<unknown> {
    const response = await HTTPService.fetch(
      config.url,
      config.method,
      this.prepareRequestConfig(config)
    );

    return config.dataPath
      ? ObjectFieldsAccessor.getValues(response, [config.dataPath])?.[0]
      : response;
  }

  private static prepareRequestConfig(
    config: Readonly<IAdapterRequestConfig>
  ): Record<string, any> {
    return {
      headers: config.headers,
      params: config.params,
      data: config.body,
    };
  }
}
