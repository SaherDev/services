export interface ITransformer {
  get accusesKeys(): string[];
  get target(): string;
  applyAccessValuesFunction(args: any[]): any;
  validateValue(value: any): boolean;
  throwErrorForInvalidValue(value: any): void;
}
