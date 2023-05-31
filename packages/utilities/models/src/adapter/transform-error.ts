export class TransformError extends Error {
  constructor(
    public condition: string,
    public target: string,
    public severity: string,
    public message: string
  ) {
    super(message);
  }
}
