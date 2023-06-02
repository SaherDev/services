import { HTTPService } from '@services/common-helpers';
import { IAdapterRequestConfig } from '@services/models';

export class DataRetriever {
  static async pullData(
    config: Readonly<IAdapterRequestConfig>
  ): Promise<unknown> {
    return await HTTPService.fetch(
      config.url,
      config.method,
      this.prepareRequestConfig(config)
    );
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
