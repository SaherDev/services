import { ClientSession, Collection, Connection } from 'mongoose';
import {
  ICollectionsAggregator,
  IComponentNode,
  IComponentsMeta,
} from '../models';

import { ComponentsNodesFactory } from '../factories';

export class MongooseAggregator implements ICollectionsAggregator {
  constructor(
    private readonly _factory: ComponentsNodesFactory,
    private readonly _connection: Connection
  ) {}

  private _getCollection(collection: string): Collection<any> {
    const _collection = this._connection.collection(collection);

    if (!_collection) {
      throw new Error(
        `MongooseAggregator >> _getCollection >> collection ${collection} not found`
      );
    }

    return _collection;
  }

  private _startSession(): Promise<ClientSession> {
    return this._connection.startSession();
  }
  private _endSession(session: ClientSession): Promise<void> {
    return session.endSession();
  }

  private _groupComponentsByCollection(
    components: IComponentNode[]
  ): Record<string, any> {
    const collections: Record<string, any[]> = {};
    for (const item of components) {
      const arr = collections[item.collection] ?? [];
      arr.push(item.getAll());
      collections[item.collection] = arr;
    }
    return collections;
  }

  async setData(
    name: Readonly<string>,
    metaConfig: Record<string, IComponentsMeta>,
    data: any = {}
  ): Promise<[string, Array<any>]> {
    const [rootId, _, childNodes] =
      await this._factory.splitIntoComponentsNodes(name, metaConfig, data);

    const groupedNodes: Record<string, IComponentNode[]> =
      this._groupComponentsByCollection(Object.values(childNodes));
    const flattenedData: any[] = [];
    const session = await this._startSession();
    try {
      session.startTransaction();

      for (const [_collection, nodes] of Object.entries(groupedNodes)) {
        const collection = this._getCollection(_collection);
        for (const nodeData of nodes) {
          flattenedData.push(nodeData);
          await collection.insertOne(nodeData, { session });
        }
      }

      await session.commitTransaction();

      return [rootId, flattenedData];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      this._endSession(session);
    }
  }

  async _getDataByIds(
    collection: Readonly<string>,
    ids: string[]
  ): Promise<any[] | any> {}

  async getData(
    name: Readonly<string>,
    metaConfig: Record<string, IComponentsMeta>,
    query: any = {}
  ): Promise<[string, Record<string, any>]> {
    const metaDictionaryTreeMap: Map<string, string[]> =
      this._factory.buildMetaDictionaryTree(name, metaConfig);

    throw new Error(`NOT IMPLEMENTED YET`);
  }
}
