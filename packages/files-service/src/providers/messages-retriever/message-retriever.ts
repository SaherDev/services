import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import * as path from 'path';
import { ENV_CONFIG_FILE_PATH } from '@/config';
import { IMessagesRetriever } from './message-retriever.interface';
import { IQueue, QUEUE } from '@services/utilities-queue';

@Injectable()
export class MessagesRetriever implements IMessagesRetriever {
  constructor(
    @Inject(QUEUE) private readonly queueUtil: IQueue,
    private readonly configServe: ConfigService
  ) {
    this.initializeQueue();
  }
  async get(): Promise<any> {
    return await this.queueUtil.getObjects(
      this.configServe.get<string[]>(`environment.queue.sqs.attributeNames`),
      this.configServe.get<number>(`environment.queue.sqs.maxNumberOfMessages`),
      this.configServe.get<string[]>(
        `environment.queue.sqs.messageAttributeNames`
      ),
      this.configServe.get<string>(`environment.queue.sqs.queueUrl`),
      this.configServe.get<number>(`environment.queue.sqs.waitTimeSeconds`),
      this.configServe.get<boolean>(
        `environment.queue.sqs.deleteFromQueueWhilePulling`
      )
    );
  }

  private initializeQueue() {
    this.queueUtil.initialize<any>(
      this.configServe.get<string>(`environment.queue.sqs.region`),
      this.configServe.get<string>(`environment.queue.sqs.profile`),
      this.calculateCredentialsPath(
        this.configServe.get<string>(`environment.queue.sqs.credentialsPath`)
      )
    );
  }

  private calculateCredentialsPath = (filePath: string) => {
    return path.join(path.dirname(ENV_CONFIG_FILE_PATH), filePath);
  };
}
