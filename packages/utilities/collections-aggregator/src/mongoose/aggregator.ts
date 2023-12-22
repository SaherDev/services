import { Connection } from 'mongoose';
import { ICollectionsAggregator } from '@/models';

export class MongooseAggregator implements ICollectionsAggregator {
  constructor(private readonly connection: Connection) {}
}
