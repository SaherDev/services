import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IRole } from './role.interface';

@Schema({
  autoCreate: true,
  autoIndex: false,
  timestamps: { createdAt: 'createdAt', updatedAt: 'lastUpdateAt' },
})
export class MongoRole implements IRole {
  @Prop()
  id: string;

  @Prop()
  permissions: string[];
}

export type RoleDocument = MongoRole & Document;
export const RoleSchema = SchemaFactory.createForClass(MongoRole);
