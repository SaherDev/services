import { Readable } from 'stream';
export class StreamProcessor {
  static readStreamAsJson(stream: Readable): Promise<any> {
    return new Promise((resolve, reject) => {
      let data = '';
      stream.on('data', (chunk) => (data += chunk));
      stream.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (e) {
          reject(e);
        }
      });
      stream.on('error', (error) => reject(error));
    });
  }
}
