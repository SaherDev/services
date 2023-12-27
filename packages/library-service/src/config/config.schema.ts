import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  LIBRARY_SERVICE_FILE_PATH: Joi.string(),
  COMMON_CONFIG_FILE_PATH: Joi.string(),
});
