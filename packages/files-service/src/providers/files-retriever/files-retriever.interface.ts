export interface IFilesRetriever {
  get(Key: Readonly<string>): Promise<string>;
  set(Key: Readonly<string>, body: Readonly<string>): Promise<void>;
}
