import { IFormData } from './form-data.interface';
import { IFormDataFile } from './form-data-file.interface';
import { IFormDataInfo } from './form-data-info.interface';

export class MultipartFormData implements IFormData {
  constructor(public files: IFormDataFile[], public info: IFormDataInfo) {}
}
