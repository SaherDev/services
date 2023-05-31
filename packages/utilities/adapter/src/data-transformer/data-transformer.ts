import {
  IAdapterDictionaryConfig,
  IAdapterTransformerConfig,
  ITransformError,
  ITransformResult,
  TransformError,
  TransformResult,
} from '@services/models';

export class DataTransformer {
  static async transform<T>(
    rowsDataAsync: AsyncGenerator<any, void, void>,
    transformers: IAdapterTransformerConfig[],
    lookups: IAdapterDictionaryConfig
  ): Promise<ITransformResult<T>> {
    const result = new TransformResult<T>([], []);

    for await (const value of rowsDataAsync) {
      this.transformRowAndSetResult<T>(value, transformers, lookups, result);
    }
    return result;
  }

  private static transformRowAndSetResult<T>(
    row: Readonly<any>,
    transformers: IAdapterTransformerConfig[],
    lookups: IAdapterDictionaryConfig,
    result: ITransformResult<T>
  ): void {
    const newRowObject = {};

    transformers.forEach((transformer) => {
      try {
        this.transformColumn<T>(row, newRowObject, transformer, lookups);
      } catch (error) {
        if (error instanceof TransformError) {
          result.pushError(error as ITransformError);
        }
      }
    });

    if (Object.keys(newRowObject).length > 0)
      result.pushData(newRowObject as T);
  }

  private static transformColumn<T>(
    originalData: any,
    targetData: any,
    transformers: IAdapterTransformerConfig,
    lookups: IAdapterDictionaryConfig
  ): void {
    return null;
  }
  private static fromValues(
    originalData: any,
    accessKeys: Readonly<string[]>,
    defaultValue: Readonly<string>,
    lookups: IAdapterDictionaryConfig,
    accessFnc?: string
  ): any {}
  private static toTarget(target: Readonly<string>) {}
  private static validateResult(): boolean {
    throw new TransformError('dl', 'l;d', '', '');
  }

  private static generateFromFunction(
    accessKeys: Readonly<string[]>,
    defaultValue: Readonly<string>,
    lookups: IAdapterDictionaryConfig,
    accessFnc?: string
  ): Function {
    return null;
  }
}
