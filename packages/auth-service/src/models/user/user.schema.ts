import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';
import { IUser } from './user.interface';

@Schema({
  autoCreate: false,
  autoIndex: false,
  timestamps: { createdAt: 'createdAt', updatedAt: 'lastUpdateAt' },
})
export class MongoUser implements IUser {
  @Prop({
    required: true,
    unique: true,
  })
  id: string;

  @Prop({
    required: true,
  })
  firstName: string;

  @Prop({
    required: true,
  })
  lastName: string;

  @Prop({
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  @Prop()
  password: string;

  @Prop()
  roles: string[];

  @Prop()
  isActive: boolean;
}

export type UserDocument = MongoUser & Document;

export const UserSchema = SchemaFactory.createForClass(MongoUser);
