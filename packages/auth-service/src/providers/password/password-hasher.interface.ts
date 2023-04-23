export interface IPasswordHasher {
  hashPasWord(password: Readonly<string>): Promise<string>;
  verifyPassword(password: Readonly<string>): Promise<boolean>;
}
