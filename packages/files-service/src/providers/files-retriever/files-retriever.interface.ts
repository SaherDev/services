export interface IFilesRetriever {
  get(Key: Readonly<string>): Promise<any>;
  set(Key: Readonly<string>, file: Buffer): Promise<string>;
  getSignedUrl(key: string): Promise<string>;
}
