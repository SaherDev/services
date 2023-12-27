import { ConfigService } from '@nestjs/config';
import {
  COLLECTIONS_AGGREGATOR,
  ICollectionsAggregator,
  IComponentsMeta,
} from '@services/collections-aggregator';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class LibraryService {
  private logger = new Logger(LibraryService.name);
  private _metaConfig: Record<string, IComponentsMeta>;

  constructor(
    @Inject(COLLECTIONS_AGGREGATOR)
    private readonly collectionsAggregator: ICollectionsAggregator,
    private readonly config: ConfigService
  ) {
    this._metaConfig = this.config.get('global.componentMetaConfig');
  }

  async createLibraryObject(
    name: Readonly<string>,
    data: Object
  ): Promise<any> {
    try {
      return this.collectionsAggregator.set(name, this._metaConfig, data);
    } catch (error) {
      this.logger.error(
        `LibraryService >> createLibraryObject >>  name = ${name}, error: `,
        error
      );
      throw new InternalServerErrorException('create library object Failed!');
    }
  }

  async findLibraryObject(name: Readonly<string>, query: Object): Promise<any> {
    try {
      return this.collectionsAggregator.find(
        name,
        this._metaConfig,
        query,
        false
      );
    } catch (error) {
      this.logger.error(
        `LibraryService >> findLibraryObject >>  name = ${name}, error: `,
        error
      );

      throw new InternalServerErrorException('find library object Failed!');
    }
  }
}
