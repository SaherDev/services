import { Exclude, Expose } from 'class-transformer';

import { IsString } from 'class-validator';

export class FileDto {
  @IsString()
  @Exclude()
  fileId: string;

  @IsString()
  @Expose()
  filePath: string;
}
