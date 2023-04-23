import { ConfigService } from '@nestjs/config';
import { ISessionDecoder } from './session-parser.interface';
import { IUserSession } from '@services/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionDecoder implements ISessionDecoder {
  private sessionKeyPrefix: string;

  constructor(private readonly configService: ConfigService) {
    this.generateConfigs();
  }

  parseSession() {}
  async generateSessionValue(user: IUserSession) {}

  private generateConfigs() {
    this.sessionKeyPrefix = this.configService.get<string>(
      'common.auth.sessionKeyPrefix'
    );
  }
}
