import { uuid } from './uuid';

export const fileUuid = (originalname: Readonly<string>) => {
  return `${uuid()}${originalname.substring(originalname.lastIndexOf('.'))}`;
};
