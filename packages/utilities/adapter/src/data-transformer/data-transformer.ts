import {
  IAdapterDictionaryConfig,
  IAdapterTransformerConfig,
  ITransformError,
  ITransformResult,
} from '@services/models';

export class DataTransformer {
  static transformRow<T>(
    row: Readonly<any>,
    transformers: IAdapterTransformerConfig[],
    lookups: IAdapterDictionaryConfig
  ): ITransformResult<T> {
    const result: ITransformResult<T> = {
      data: {} as T,
      errors: [],
    };
    transformers.forEach((transformer) => {
      this.transformColumn<T>(row, result, transformer, lookups);
    });
    return result;
  }

  private static transformColumn<T>(
    originalData: any,
    result: ITransformResult<T>,
    transformers: IAdapterTransformerConfig,
    lookups: IAdapterDictionaryConfig
  ): void {
    return null;
  }
  private static fromValues(
    accessKeys: Readonly<string[]>,
    defaultValue: Readonly<string>,
    lookups: IAdapterDictionaryConfig,
    accessFnc?: string
  ): any {}
  private static toTarget(target: Readonly<string>) {}
  private static validateResult(): boolean {
    return false;
  }
}
