import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  FILES_SERVICE_FILE_PATH: Joi.string().required(),
});
