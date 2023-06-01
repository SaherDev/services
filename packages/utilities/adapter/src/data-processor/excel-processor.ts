import { IBufferProcessor } from '@services/models';
import { ObjectFieldsAccessor } from '@services/common-helpers';
export class ExcelProcessor implements IBufferProcessor {
  async *toRowsAsync(
    buffer: any,
    options: Record<string, any> = {}
  ): AsyncGenerator<any, void, void> {
    const sheetName = options?.sheetName;

    const workbook = await buffer.xlsx.readFile(buffer.path);
    const sheet = workbook?.sheets?.[sheetName];

    if (!sheet) {
      throw new Error(`Sheet ${sheetName} not found`);
    }

    const rows = sheet.getRows();
    const header = rows[0];

    const data = rows.slice(1);

    for await (const row of data) {
      const obj = {};

      for (const [index, value] of row.entries()) {
        ObjectFieldsAccessor.setValue(header[index], obj, value);
      }

      yield obj;
    }
  }
}
