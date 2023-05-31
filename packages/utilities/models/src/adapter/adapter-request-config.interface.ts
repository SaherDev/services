export interface IAdapterRequestConfig {
  url: string;
  method: 'GET' | 'POST';
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: Record<string, unknown>;
  dataPath?: string;
}
