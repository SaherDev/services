import { ClientSession, Collection, Connection } from 'mongoose';
import { ICollectionsAggregator, IComponentNode } from '../models';

export class MongooseAggregator implements ICollectionsAggregator {
  constructor(private readonly connection: Connection) {}

  private _getCollection(collection: string): Collection<any> {
    return this.connection.collection(collection);
  }

  private _startSession(): Promise<ClientSession> {
    return this.connection.startSession();
  }
  private _endSession(session: ClientSession): Promise<void> {
    return session.endSession();
  }

  private _groupComponentsByCollection(
    components: IComponentNode[]
  ): Record<string, IComponentNode[]> {
    const collections: Record<string, IComponentNode[]> = {};
    for (const item of components) {
      const arr = collections[item.collection] ?? [];
      arr.push(item);
      collections[item.collection] = arr;
    }
    return collections;
  }

  async setComponentsData(
    components: IComponentNode[]
  ): Promise<Record<string, any>> {
    const collections: Record<string, IComponentNode[]> =
      this._groupComponentsByCollection(components);

    const session = await this._startSession();

    try {
      session.startTransaction();

      for (const [_collection, components] of Object.entries(collections)) {
        const collection = this._getCollection(_collection);
        for (const component of components) {
          await collection.insertOne(component.getAll(), { session });
        }
      }

      await session.commitTransaction();
      return collections;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      this._endSession(session);
    }
  }

  async getComponentsData(
    collection: string,
    components: IComponentNode[]
  ): Promise<[string, Record<string, any>]> {
    throw new Error('Method not implemented.');
  }
}
