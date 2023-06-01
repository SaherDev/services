import { DataSourceType } from './data-source-type.enum';
import { IAdapterLookupConfig } from './adapter-lookup.config.interface';
import { IAdapterParserConfig } from './adapter.parser.config.interface';
import { IAdapterRequestConfig } from './adapter-request-config.interface';
import { IAdapterTransformerConfig } from './adapter-transformer-config.interface';

export interface IAdapterSchema {
  meta: any;
  dataType: DataSourceType;
  parser: IAdapterParserConfig;
  transformer: IAdapterTransformerConfig[];
  lookups: IAdapterLookupConfig[];
  request?: IAdapterRequestConfig;
}
