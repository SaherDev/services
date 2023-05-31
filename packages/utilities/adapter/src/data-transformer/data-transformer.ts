import {
  IAdapterLookupConfig,
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
    lookups: IAdapterLookupConfig[]
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
    lookups: IAdapterLookupConfig[],
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
    targetObject: any,
    transformer: IAdapterTransformerConfig,
    lookups: IAdapterLookupConfig[]
  ): void {
    const fromValue: any = this.fromValue(
      originalData,
      transformer.accessKeys,
      transformer.defaultValue,
      transformer.lookupName,
      lookups,
      transformer.accessFnc
    );

    this.toTarget(targetObject, fromValue, transformer);
  }
  private static fromValue(
    originalData: any,
    accessKey: Readonly<string[]>,
    defaultValue: Readonly<string> = '',
    lookupName: Readonly<string>,
    lookups: IAdapterLookupConfig[] = [],
    accessFnc: string = ''
  ): any {
    const processorFunc: Function = this.generateFinalFromFunction(
      lookupName,
      lookups,
      accessFnc
    );

    return (
      processorFunc(...this.getValuesFromData(originalData, accessKey)) ??
      defaultValue
    );
  }

  private static toTarget(
    targetObject: any,
    value: any,
    transformer: IAdapterTransformerConfig
  ): void {
    const validateResult: boolean = this.validateValue(value, transformer);
    if (!validateResult) {
      ///empty value
      throw new TransformError(
        transformer.target,
        transformer.validate?.condition ?? '',
        transformer.validate?.severity ?? '',
        transformer.validate?.message ?? ''
      );
    } else {
      ///real value
    }
  }

  private static validateValue(
    value: any,
    transformer: IAdapterTransformerConfig
  ): boolean {
    if (transformer.validate) {
      const evalFunc = eval(transformer.validate.condition);
      if (evalFunc) return evalFunc;
    }
    return value;
  }

  private static getValuesFromData(
    data: any,
    accessKey: Readonly<string[]>
  ): any[] {
    return accessKey.map((key) => {
      return key.split('.').reduce((currentValue, keyPart) => {
        if (
          currentValue &&
          typeof currentValue === 'object' &&
          keyPart in currentValue
        ) {
          return currentValue[keyPart];
        } else {
          return undefined;
        }
      }, data);
    });
  }

  private static generateFinalFromFunction(
    lookupName: Readonly<string>,
    lookups: IAdapterLookupConfig[],
    accessFnc: string = ''
  ): Function {
    const evalFunc = eval(accessFnc);
    if (evalFunc) return evalFunc;

    if (lookupName) {
      const lookup = lookups.find((l) => l.name === lookupName);
      if (lookup) {
        return (value: any) => lookup.options[value] ?? lookup.defaultValue;
      }
    }
    return (value: any) => value;
  }
}
