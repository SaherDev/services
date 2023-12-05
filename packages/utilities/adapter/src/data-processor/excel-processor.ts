import { IAdapterParserConfig, IBufferProcessor } from '../models';

import { ObjectFieldsAccessor } from '@services/common-helpers';
import readXlsxFile from 'read-excel-file/node';

export class ExcelProcessor implements IBufferProcessor {
  async *toRowsAsync(
    buffer: any,
    config: IAdapterParserConfig
  ): AsyncGenerator<any, void, void> {
    const sheetName = config?.dataPath ?? 1;

    const rows = await readXlsxFile(buffer, { sheet: sheetName });

    const [headers, ...data] = rows;

    for (const row of data) {
      const obj = {};

      headers.forEach((header, index) => {
        ObjectFieldsAccessor.setValue(header.toString(), obj, row[index]);
      });

      yield obj;
    }
  }
}
