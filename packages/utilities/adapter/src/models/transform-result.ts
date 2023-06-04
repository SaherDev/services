import { ITransformError } from './transform-error.interface';
import { ITransformResult } from './transform-result.interface';

export class TransformResult<T> implements ITransformResult<T> {
  constructor(public data: T[], public errors: ITransformError[]) {}

  pushError(error: ITransformError): void {
    this.errors.push(error);
  }
  pushData(data: T): void {
    this.data.push(data);
  }
}
