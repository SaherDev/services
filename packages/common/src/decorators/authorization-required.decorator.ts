import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';

import { AuthorizationGuard } from '../guards';

export const AuthorizationRequired = (permissions: string[]) => {
  return applyDecorators(
    SetMetadata('permissions', permissions),
    UseGuards(AuthorizationGuard)
  );
};
