import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  AUTH_SERVICE_CONFIG_FILE_PATH: Joi.string().required(),
  COMMON_CONFIG_FILE_PATH: Joi.string(),
});
