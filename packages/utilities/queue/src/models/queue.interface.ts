export interface IQueue {
  initialize<T>(
    region: Readonly<string>,
    profile: Readonly<string>,
    credentialsPath: Readonly<string>
  ): T;

  putObject<T>(
    queueUrl: Readonly<string>,
    delaySeconds: Readonly<number>,
    body: Readonly<string>
  ): Promise<T>;

  getObjects<T>(
    attributeNames: string[],
    maxNumberOfMessages: Readonly<number>,
    messageAttributeNames: string[],
    queueUrl: Readonly<string>,
    waitTimeSeconds: Readonly<number>,
    deleteFromQueue: Readonly<boolean>
  ): Promise<T>;
}
