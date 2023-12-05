import { ITransformError } from './transform-error.interface';

export interface ITransformResult<T> {
  get data(): T[];
  get errors(): ITransformError[];
  pushError(error: ITransformError): void;
  pushData(data: T): void;
}
