import { DataSourceType } from '@services/models';

export class Adapter {
  static async pullData(): Promise<any> {
    return null;
  }

  static async parseData(
    schemaDataType: DataSourceType,
    data: any,
    options: Record<string, any> = {}
  ): Promise<any> {}

  static async transformData(): Promise<any> {
    return null;
  }
}
