export interface IFilesRetriever {
  get(Key: Readonly<string>): Promise<any>;
  set(Key: Readonly<string>, body: Readonly<string>): Promise<void>;
}
