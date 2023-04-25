import { ApiBody, ApiConsumes } from '@nestjs/swagger';

import { applyDecorators } from '@nestjs/common';

export const ApiMultipartFormData = (
  dynamicProperties: Record<string, any> = {}
) =>
  applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          files: {
            type: 'array',
            items: { type: 'string', format: 'binary' },
          },
          info: { type: 'string' },
          ...dynamicProperties,
        },
      },
    })
  );
