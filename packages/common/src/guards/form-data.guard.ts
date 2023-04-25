import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { IFormDataFile, IFormDataInfo, MultipartFormData } from '../models';
import { Multipart, MultipartFile, MultipartValue } from '@fastify/multipart';

import { FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    file: () => MultipartFile;
    isMultipart: () => boolean;
  }
}

@Injectable()
export class FormDataGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const isMultipart = req.isMultipart();
    if (!isMultipart)
      throw new BadRequestException('multipart/form-data expected.');
    const multiPart = await req.file();

    if (!multiPart) throw new BadRequestException('file expected');

    return this.extractFromData(req, multiPart);
  }

  private extractFiles(files: Multipart | Multipart[]): IFormDataFile[] {
    if (!files) return [];

    const multiPartArray: MultipartFile[] = (
      Array.isArray(files) ? files : [files]
    ) as MultipartFile[];

    return multiPartArray.filter((formFIeld) => formFIeld.type === 'file');
  }

  private extractInfo(multiPrtInfo: Multipart | Multipart[]): IFormDataInfo {
    if (!multiPrtInfo) return {};

    const multiPartArray: MultipartValue[] = (
      Array.isArray(multiPrtInfo) ? multiPrtInfo : [multiPrtInfo]
    ) as MultipartValue[];
    let info = {};

    multiPartArray.forEach((filed) => {
      Object.assign(info, JSON.parse(filed.value as string));
    });

    return info;
  }

  private extractFromData(
    request: FastifyRequest,
    multiPartFile: MultipartFile
  ): boolean {
    try {
      request['incomingFormData'] = new MultipartFormData(
        this.extractFiles(multiPartFile.fields['files']),
        this.extractInfo(multiPartFile.fields['info'])
      );
    } catch (error) {
      throw new BadRequestException('file expected');
    }

    return true;
  }
}
