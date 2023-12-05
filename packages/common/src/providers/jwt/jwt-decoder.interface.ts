import { TokenType } from '@services/models';

export interface IJwtDecoder {
  sign(payload: any, type: TokenType): Promise<string>;
  verify<T>(token: Readonly<string>, type: TokenType): Promise<T>;
}
