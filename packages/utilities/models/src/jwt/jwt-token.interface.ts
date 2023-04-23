export interface IJwtToken<T> {
  object: T;
  iat: number;
  exp: number;
  sub: string;
}
