export interface IMessagesRetriever {
  get(): Promise<any>;
  put(message: Readonly<string>): Promise<any>;
}
