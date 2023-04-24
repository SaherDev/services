import { IFormDataFile } from './form-data-file.interface';
import { IFormDataInfo } from './form-data-info.interface';

export interface IFormData {
  get files(): IFormDataFile[];
  get info(): IFormDataInfo;
}
