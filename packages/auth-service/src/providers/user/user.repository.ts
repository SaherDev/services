import { IUser, MongoUser, User, UserDocument } from '@/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { generateMongoQuery } from '@services/common';
import { IDatabaseFindManyQuey, IDatabaseQuey } from '@services/models';
import { Model } from 'mongoose';
import { IUserRepository } from './user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(MongoUser.name) private rolesModel: Model<UserDocument>
  ) {}

  async findMany(value: IDatabaseFindManyQuey<IUser>): Promise<IUser[]> {
    const query = generateMongoQuery(value);

    const response = await this.rolesModel.find(query);
    return response.map((doc) => this.dbToObject(doc));
  }

  async updateOne(
    query: IDatabaseQuey<IUser>,
    value: Partial<IUser>
  ): Promise<IUser> {
    const response = await this.rolesModel.findOneAndUpdate(
      query.filter,
      value,
      {
        new: true,
      }
    );

    return this.dbToObject(response);
  }
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
