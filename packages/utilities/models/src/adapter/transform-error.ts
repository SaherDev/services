export class TransformError {
  constructor(
    public condition: string,
    public target: string,
    public severity: string,
    public message: string
  ) {}
}
