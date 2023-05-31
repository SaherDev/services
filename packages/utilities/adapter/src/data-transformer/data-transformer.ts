import {
  IAdapterLookupConfig,
  IAdapterTransformerConfig,
  ITransformError,
  ITransformResult,
  TransformError,
  TransformResult,
} from '@services/models';
import {
  ObjectFieldsAccessor,
  UntrustedCodeProcessor,
} from '@services/common-helpers';

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
        this.transformColumn(row, newRowObject, transformer, lookups);
      } catch (error) {
        if (error instanceof TransformError) {
          result.pushError(error as ITransformError);
        }
      }
    });

    if (Object.keys(newRowObject).length > 0)
      result.pushData(newRowObject as T);
  }

  private static transformColumn(
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
      processorFunc(
        ...ObjectFieldsAccessor.getValues(originalData, accessKey)
      ) ?? defaultValue
    );
  }

  private static toTarget(
    targetObject: any,
    value: any,
    transformer: IAdapterTransformerConfig
  ): void {
    const validateResult: boolean = this.validateValue(value, transformer);
    if (!validateResult) {
      ObjectFieldsAccessor.setValue(transformer.target, targetObject, '');
      throw new TransformError(
        transformer.target,
        transformer.validate?.condition ?? '',
        transformer.validate?.severity ?? '',
        transformer.validate?.message ?? 'unknown error'
      );
    } else {
      ObjectFieldsAccessor.setValue(transformer.target, targetObject, value);
    }
  }

  private static validateValue(
    value: any,
    transformer: IAdapterTransformerConfig
  ): boolean {
    if (transformer.validate) {
      try {
        const unstructuredFunc: Function | null =
          this.generateFunctionFromUnstructuredCode(
            transformer.validate.condition
          );
        if (unstructuredFunc) return unstructuredFunc(value);
      } catch (error) {}
    }
    return false;
  }

  private static generateFunctionFromUnstructuredCode(
    functionCode: Readonly<string>
  ): Function | null {
    try {
      return UntrustedCodeProcessor.process(functionCode);
    } catch (error) {}

    return null;
  }

  private static generateFinalFromFunction(
    lookupName: Readonly<string>,
    lookups: IAdapterLookupConfig[],
    accessFnc: string = ''
  ): Function {
    const unstructuredFunc: Function | null =
      this.generateFunctionFromUnstructuredCode(accessFnc);
    if (unstructuredFunc) return unstructuredFunc;

    if (lookupName) {
      const lookup = lookups.find((l) => l.name === lookupName);
      if (lookup) {
        return (value: any) => lookup.options[value] ?? lookup.defaultValue;
      }
    }
    return (value: any) => value;
  }
}
