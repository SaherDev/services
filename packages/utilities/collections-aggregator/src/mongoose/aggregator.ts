import { ClientSession, Collection, Connection } from 'mongoose';
import {
  ICollectionsAggregator,
  IComponentClassType,
  IComponentNode,
  IComponentsMeta,
} from '../models';

import { ComponentsNodesFactory } from '../factories';

export class MongooseAggregator implements ICollectionsAggregator {
  constructor(
    private readonly _factory: ComponentsNodesFactory,
    private readonly _connection: Connection
  ) {
    this._validate();
  }

  private _validate(): void {
    if (
      !(this._factory instanceof ComponentsNodesFactory) ||
      !(this._connection instanceof Connection)
    ) {
      throw new Error(
        'MongooseAggregator >> constructor failed, factory and connection are required'
      );
    }
  }

  async set(
    name: Readonly<string>,
    metaConfig: Record<string, IComponentsMeta>,
    data: any = {}
  ): Promise<[string, Array<any>]> {
    const [rootId, childNodes] = await this._factory.splitIntoComponentsNodes(
      name,
      metaConfig,
      data
    );

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

  async find(
    name: Readonly<string>,
    metaConfig: Record<string, IComponentsMeta>,
    query: Object = {},
    multipleResults = false
  ): Promise<any[] | any> {
    const metaDictionaryTreeMap: Map<string, string[]> =
      this._factory.buildMetaDictionaryTree(name, metaConfig);

    const root = metaConfig[name];

    if (!root || !root.collection)
      throw new Error(
        `MongooseAggregator >> getData >> root ${name} not found`
      );

    const rootNodes: IComponentNode[] = await this._getCollection(
      root.collection
    )
      .find<IComponentNode>(query)
      .toArray();

    if (!rootNodes.length || (rootNodes.length > 1 && !multipleResults))
      throw new Error(
        `MongooseAggregator >> getData >> root nodes not found for ${name}`
      );

    const result = await Promise.all(
      rootNodes.map((node) =>
        this._buildNode(name, metaConfig, metaDictionaryTreeMap, node)
      )
    );

    return multipleResults ? result : result?.[0];
  }

  async findComponentClass(
    name: Readonly<string>,
    metaConfig: Record<string, IComponentsMeta>,
    query: Object = {}
  ): Promise<IComponentClassType> {
    const data = await this.find(name, metaConfig, query);

    return this._factory.toComponentClass(name, metaConfig, {
      [name]: data,
    });
  }

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
      const collectionName = item['collection'];
      const arr = collections[collectionName] ?? [];
      arr.push(item.getAll());
      collections[collectionName] = arr;
    }
    return collections;
  }

  private async _getDataByIds(
    collection: Readonly<string>,
    ids: string[]
  ): Promise<any[]> {
    return await this._getCollection(collection)
      .aggregate([
        {
          $match: {
            id: { $in: ids },
          },
        },
        {
          $addFields: {
            _customOrder: {
              $indexOfArray: [ids, '$id'],
            },
          },
        },
        {
          $sort: {
            _customOrder: 1,
          },
        },
        {
          $project: {
            _customOrder: 0,
          },
        },
      ])
      .toArray();
  }

  private async _buildNode(
    name: string,
    metaConfig: Record<string, IComponentsMeta>,
    metaMap: Map<string, string[]>,
    node: any
  ): Promise<any> {
    for (const [key, value] of Object.entries(
      typeof node === 'object' ? node : {}
    )) {
      const metaKey = `${name?.split('.')?.at(-1) ?? name}.${key}`;
      const meta = metaConfig[metaKey];
      if (!meta) continue;
      const isArray: boolean = Array.isArray(value);
      const ids: string[] = (isArray ? value : [value]) as string[];
      const children = await this._getDataByIds(meta.collection, ids);
      if (!children.length || children.some((c) => !c))
        throw new Error(
          `MongooseAggregator >> buildNode >> children not found for ${JSON.stringify(
            meta
          )}`
        );
      const childNodes: IComponentNode[] = await Promise.all(
        children.map((child) =>
          this._buildNode(key, metaConfig, metaMap, child)
        )
      );

      node[key] = isArray ? childNodes : childNodes[0];
    }
    return node;
  }
}
