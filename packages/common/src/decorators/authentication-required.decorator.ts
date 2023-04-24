import { UseGuards, applyDecorators } from '@nestjs/common';

import { AuthorizationGuard } from '../guards';

export const AuthenticationRequired = () => {
  return applyDecorators(UseGuards(AuthorizationGuard));
};
