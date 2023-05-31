import { ITransformError } from './transform-error.interface';

export class TransformError extends Error {
  constructor(
    public target: string,
    public condition: string,
    public severity: string,
    public message: string
  ) {
    super(message);
  }

  toJson(): ITransformError {
    return {
      condition: this.condition,
      target: this.target,
      severity: this.severity,
      message: this.message,
    };
  }
}
