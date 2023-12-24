import { uuid } from '@services/common-helpers';

export const fileUuid = (originalname: Readonly<string>) => {
  return `${uuid()}${originalname.substring(originalname.lastIndexOf('.'))}`;
};
