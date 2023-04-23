import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { FastifyRequest } from 'fastify';

@Injectable({ scope: Scope.REQUEST })
export class SessionProvider {
  constructor(@Inject(REQUEST) private readonly request: FastifyRequest) {}

  get(key: string): any {
    //@ts-ignore
    return this.request.session.get(key);
  }

  set(key: string, value: any): void {
    //@ts-ignore
    this.request.session.set(key, value);
  }
}
