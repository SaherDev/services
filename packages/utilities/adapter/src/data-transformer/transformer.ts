import {
  IAdapterTransformerConfig,
  ITransformer,
  TransformError,
} from '@services/models';
export class Transformer implements ITransformer {
  constructor(
    private config: IAdapterTransformerConfig,
    private accessValuesFunc: Function,
    private validationFunc: Function
  ) {}

  get accusesKeys(): string[] {
    return this.config.accessKeys ?? [];
  }

  get target(): string {
    return this.config.target;
  }

  applyAccessValuesFunction(args: any[]): any {
    return this.accessValuesFunc(...args) ?? this.config.defaultValue;
  }

  validateValue(value: any): boolean {
    if (this.config?.validate) {
      try {
        return this.validationFunc(value);
      } catch (error) {
        return false;
      }
    }
    return true;
  }

  throwErrorForInvalidValue(value: any): void {
    throw new TransformError(
      this.config.target,
      value,
      this.config.validate?.condition ?? '',
      this.config.validate?.severity ?? '',
      this.config.validate?.message ?? 'unknown error'
    );
  }
}
