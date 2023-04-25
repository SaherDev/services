import { ApiBody } from '@nestjs/swagger';

export function ApiFileUpload(dynamicProperties: Record<string, any> = {}) {
  return ApiBody({
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
  });
}
