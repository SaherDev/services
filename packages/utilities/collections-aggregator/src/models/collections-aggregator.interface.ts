import { IComponentsMeta } from './components-meta.interface';

export interface ICollectionsAggregator {
  setData(
    name: Readonly<string>,
    metaConfig: Record<string, IComponentsMeta>,
    data: any
  ): Promise<[string, Array<any>]>;
}
