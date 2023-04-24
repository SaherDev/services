import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const FormData = createParamDecorator(
  async (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req['incomingFormData'];
  }
);
