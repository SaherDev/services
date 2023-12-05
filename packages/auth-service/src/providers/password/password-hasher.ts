import { scrypt as _scrypt, randomBytes } from 'crypto';

import { ConfigService } from '@nestjs/config';
import { IPasswordHasher } from './password-hasher.interface';
import { Injectable } from '@nestjs/common';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class PasswordHasher implements IPasswordHasher {
  private passwordSeparator: string;

  constructor(private configService: ConfigService) {
    this.passwordSeparator = this.configService.get(
      'environment.auth.passwordSeparator'
    );
  }

  async hashPasWord(password: Readonly<string>): Promise<string> {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    return `${salt}${this.passwordSeparator}${hash.toString('hex')}`;
  }

  async verifyPassword(
    password: Readonly<string>,
    storePassword: Readonly<string>
  ): Promise<boolean> {
    const [salt, storedHash] = storePassword.split(this.passwordSeparator);

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      return false;
    }

    return true;
  }
}
