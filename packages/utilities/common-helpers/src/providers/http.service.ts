import axios, { AxiosInstance, Method } from 'axios';

import { IHTTPFetchConfig } from '@/models';

export class HTTPService {
  private static readonly httpClient: AxiosInstance = axios.create();

  static async fetch<T>(
    url: string,
    method: Method,
    config?: IHTTPFetchConfig
  ): Promise<T> {
    const response = await this.httpClient.request({
      url,
      method,
      ...config,
    });
    return response.data as T;
  }
}
