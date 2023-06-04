import { ITransformError } from './transform-error.interface';

export class TransformError extends Error {
  constructor(
    public target: string,
    public value: any,
    public condition: string,
    public severity: string,
    public message: string
  ) {
    super(message);
  }

  toJson(): ITransformError {
    return {
      value: this.value,
      condition: this.condition,
      target: this.target,
      severity: this.severity,
      message: this.message,
    };
  }
}
