import { ITransformError } from './transform-error.interface';

export interface ITransformResult<T> {
  data: T | T[];
  errors: ITransformError[];
}
