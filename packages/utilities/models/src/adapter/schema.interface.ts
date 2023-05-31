import { DataSourceType } from './data-source-type.enum';
import { IAdapterLookupConfig } from './adapter-lookup.config.interface';
import { IAdapterRequestConfig } from './adapter-request-config.interface';
import { IAdapterTransformerConfig } from './adapter-transformer-config.interface';

export interface IAdapterSchema {
  dataType: DataSourceType;
  transformers: IAdapterTransformerConfig[];
  lookups: IAdapterLookupConfig[];
  request?: IAdapterRequestConfig;
}
