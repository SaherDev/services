import {
  DeleteMessageBatchCommand,
  DeleteMessageBatchRequestEntry,
  DeleteMessageBatchResult,
  Message,
  ReceiveMessageCommand,
  ReceiveMessageCommandOutput,
  SQSClient,
} from '@aws-sdk/client-sqs';

import { IQueue } from '@/models';
import { fromIni } from '@aws-sdk/credential-providers';

export class Sqs implements IQueue {
  private client: SQSClient;
  private ready: boolean;

  constructor() {
    this.ready = false;
  }

  initialize<T>(
    region: Readonly<string>,
    profile: Readonly<string>,
    credentialsPath: Readonly<string>
  ): T {
    if (!region || !profile || !credentialsPath) {
      this.ready = false;
      throw new Error(
        `fields are missing >> region = ${region}, profile = ${profile},  credentialsPath = ${credentialsPath} `
      );
    }

    try {
      this.client = new SQSClient({
        region: region,
        credentials: fromIni({
          profile: profile,
          filepath: credentialsPath,
        }),
      });
    } catch (err) {
      this.client = null;
      this.ready = false;
      throw new Error(
        `creating client failed >> error = ${JSON.stringify(err)}`
      );
    }

    this.ready = true;

    return this.client as T;
  }

  async getObjects<T>(
    attributeNames: string[],
    maxNumberOfMessages: Readonly<number>,
    messageAttributeNames: string[],
    queueUrl: Readonly<string>,
    waitTimeSeconds: Readonly<number>,
    deleteFromQueue: Readonly<boolean>
  ): Promise<T> {
    if (!this.ready) {
      throw new Error('not ready');
    }

    this.validateGetObjectsFieldsOrThrowError(
      attributeNames,
      maxNumberOfMessages,
      messageAttributeNames,
      queueUrl,
      waitTimeSeconds,
      deleteFromQueue
    );

    let responseObject: ReceiveMessageCommandOutput = null;
    let error: any = null;
    try {
      responseObject = await this.client.send(
        new ReceiveMessageCommand({
          AttributeNames: attributeNames,
          MaxNumberOfMessages: maxNumberOfMessages,
          MessageAttributeNames: messageAttributeNames,
          QueueUrl: queueUrl,
          WaitTimeSeconds: waitTimeSeconds,
        })
      );
    } catch (err: any) {
      error = err;
    }

    if (!responseObject || error)
      throw new Error(
        `failed to get Objects from queue >>  error = ${JSON.stringify(error)}`
      );

    if (!responseObject.Messages || responseObject.Messages.length === 0) {
      return [] as T;
    }

    if (deleteFromQueue)
      await this.deleteMessagesFromQueue(responseObject.Messages, queueUrl);

    return responseObject.Messages.map((message) => message.Body) as T;
  }

  private async deleteMessagesFromQueue<T>(
    messages: Message[],
    queueUrl: Readonly<string>
  ): Promise<T> {
    if (!messages || messages.length === 0 || !queueUrl) {
      throw new Error(`input fields are missing`);
    }
    const messagesArray: DeleteMessageBatchRequestEntry[] = [];

    messages.forEach((message: Message) => {
      messagesArray.push({
        Id: message.MessageId,
        ReceiptHandle: message.ReceiptHandle,
      });
    });

    let responseObject: DeleteMessageBatchResult;
    let error: any;
    try {
      responseObject = await this.client.send(
        new DeleteMessageBatchCommand({
          Entries: messagesArray,
          QueueUrl: queueUrl,
        })
      );
    } catch (err: any) {
      error = err;
      responseObject = null;
    }

    if (!responseObject || !responseObject.Successful || error)
      throw new Error(
        `failed to delete messages >> error = ${JSON.stringify(error)}`
      );
    return messages as T;
  }

  private validateGetObjectsFieldsOrThrowError(
    attributeNames: string[],
    maxNumberOfMessages: Readonly<number>,
    messageAttributeNames: string[],
    queueUrl: Readonly<string>,
    waitTimeSeconds: Readonly<number>,
    deleteFromQueue: Readonly<boolean>
  ): boolean {
    if (
      !attributeNames ||
      !attributeNames.length ||
      maxNumberOfMessages < 0 ||
      !messageAttributeNames ||
      !messageAttributeNames.length ||
      !queueUrl
    )
      throw new Error(`input fields are missing`);

    return true;
  }
}
