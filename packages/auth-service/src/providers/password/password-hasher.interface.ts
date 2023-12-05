export interface IPasswordHasher {
  hashPasWord(password: Readonly<string>): Promise<string>;
  verifyPassword(
    password: Readonly<string>,
    storePassword: Readonly<string>
  ): Promise<boolean>;
}
