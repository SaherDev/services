import { AxiosRequestConfig } from 'axios';

export interface IHTTPFetchConfig extends AxiosRequestConfig {
  url?: string;
  method: never;
}
