import { DataSourceType } from './data-source-type.enum';
import { IAdapterDictionaryConfig } from './adapter-dictionary.config.interface';
import { IAdapterRequestConfig } from './adapter-request-config.interface';
import { IAdapterTransformerConfig } from './adapter-transformer-config.interface';

export interface IAdapterSchema {
  dataType: DataSourceType;
  transformers: IAdapterTransformerConfig[];
  lookups: IAdapterDictionaryConfig[];
  request?: IAdapterRequestConfig;
}
