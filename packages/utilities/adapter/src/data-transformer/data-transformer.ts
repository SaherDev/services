import {
  IAdapterLookupConfig,
  IAdapterTransformerConfig,
  ITransformResult,
  ITransformer,
  TransformError,
  TransformResult,
} from '@/models';
import {
  ObjectFieldsAccessor,
  UntrustedCodeProcessor,
} from '@services/common-helpers';

import { Transformer } from './transformer';

export class DataTransformer {
  static async transform<T>(
    rowsDataAsync: AsyncGenerator<any, void, void>,
    config: IAdapterTransformerConfig[],
    lookups: IAdapterLookupConfig[]
  ): Promise<ITransformResult<T>> {
    const result = new TransformResult<T>([], []);
    const transformers: ITransformer[] = this.prepareTransformers(
      config,
      lookups
    );
    for await (const value of rowsDataAsync) {
      this.transformRowAndSetResult<T>(value, transformers, result);
    }
    return result;
  }

  private static transformRowAndSetResult<T>(
    row: Readonly<any>,
    transformers: ITransformer[],
    result: ITransformResult<T>
  ): void {
    const newRowObject = {};

    transformers.forEach((transformer) => {
      try {
        this.transformColumn(row, newRowObject, transformer);
      } catch (error) {
        if (error instanceof TransformError) {
          result.pushError(error.toJson());
        }
      }
    });

    if (Object.keys(newRowObject).length > 0)
      result.pushData(newRowObject as T);
  }

  private static transformColumn(
    originalData: any,
    targetObject: any,
    transformer: ITransformer
  ): void {
    const fromValue: any = transformer.applyAccessValuesFunction(
      ObjectFieldsAccessor.getValues(originalData, transformer.accusesKeys)
    );

    this.toTarget(targetObject, fromValue, transformer);
  }

  private static toTarget(
    targetObject: any,
    value: any,
    transformer: ITransformer
  ): void {
    const validateResult: boolean = transformer.validateValue(value);
    if (!validateResult) {
      ObjectFieldsAccessor.setValue(transformer.target, targetObject, '');
      transformer.throwErrorForInvalidValue(value);
    } else {
      ObjectFieldsAccessor.setValue(transformer.target, targetObject, value);
    }
  }

  private static generateFunctionFromUnstructuredCode(
    functionCode: Readonly<string>
  ): Function | null {
    try {
      return UntrustedCodeProcessor.process(functionCode);
    } catch (error) {}

    return null;
  }

  private static prepareTransformers(
    transformers: IAdapterTransformerConfig[],
    lookups: IAdapterLookupConfig[]
  ): ITransformer[] {
    const lookupsMap: Map<string, IAdapterLookupConfig> = new Map(
      lookups.map((l) => [l.name, l])
    );

    return transformers.map((config) => {
      return new Transformer(
        config,
        this.generateFromFunction(
          config?.accessFnc,
          lookupsMap.get(config.lookupName)
        ),
        this.generateFunctionFromUnstructuredCode(config?.validate?.condition)
      );
    });
  }

  private static generateFromFunction(
    accessFnc: string = '',
    lookup: IAdapterLookupConfig
  ): Function {
    const unstructuredFunc: Function | null =
      this.generateFunctionFromUnstructuredCode(accessFnc);
    if (unstructuredFunc) return unstructuredFunc;

    if (lookup) {
      return (value: any) => lookup.options[value] ?? lookup.defaultValue;
    }
    return (value: any) => value;
  }
}
