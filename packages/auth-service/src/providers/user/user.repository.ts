import { IUser, MongoUser, User, UserDocument } from '@/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IDatabaseQuey } from '@services/models';
import { Model } from 'mongoose';
import { IUserRepository } from './user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(MongoUser.name) private rolesModel: Model<UserDocument>
  ) {}
  async findOne(value: IDatabaseQuey<IUser>): Promise<IUser> {
    const response = await this.rolesModel.findOne(value.filter);

    return this.dbToObject(response);
  }
  async store(value: IUser): Promise<IUser> {
    const response = await this.rolesModel.create(value);
    return this.dbToObject(response);
  }

  private dbToObject(doc: UserDocument): IUser {
    if (!doc) return null;

    return new User(
      doc.id,
      doc.firstName,
      doc.lastName,
      doc.userName,
      doc.password,
      doc.roles,
      doc.isActive
    );
  }
}
