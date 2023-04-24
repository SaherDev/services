import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';

import { AuthenticationGuard } from '../guards';

export const AuthorizationRequired = (permissions: string[]) => {
  return applyDecorators(
    SetMetadata('permissions', permissions),
    UseGuards(AuthenticationGuard)
  );
};
