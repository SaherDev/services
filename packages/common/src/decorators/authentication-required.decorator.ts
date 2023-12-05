import { UseGuards, applyDecorators } from '@nestjs/common';

import { AuthenticationGuard } from '../guards';

export const AuthenticationRequired = () => {
  return applyDecorators(UseGuards(AuthenticationGuard));
};
