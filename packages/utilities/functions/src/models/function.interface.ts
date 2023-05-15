export interface IFunction {
  initialize<T>(
    region: Readonly<string>,
    profile: Readonly<string>,
    credentialsPath: Readonly<string>
  ): T;

  invokeFunction<T>(
    name: Readonly<string>,
    type: Readonly<string>,
    payload: Readonly<any>
  ): Promise<T>;
}
