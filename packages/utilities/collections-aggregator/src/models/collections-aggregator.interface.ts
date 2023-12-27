import { IComponentClassType } from './component-class-type.interface';
import { IComponentsMeta } from './components-meta.interface';

export interface ICollectionsAggregator {
  set(
    name: Readonly<string>,
    metaConfig: Record<string, IComponentsMeta>,
    data: any
  ): Promise<[string, Array<any>]>;

  find(
    name: Readonly<string>,
    metaConfig: Record<string, IComponentsMeta>,
    query: Object,
    multipleResults: Readonly<boolean>
  ): Promise<any[] | any>;

  findComponentClass(
    name: Readonly<string>,
    metaConfig: Record<string, IComponentsMeta>,
    query: Object
  ): Promise<IComponentClassType>;
}
