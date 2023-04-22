import { IUser, MongoUser, UserDocument } from '@/models';
import { InjectModel } from '@nestjs/mongoose';
import { IDatabaseQuey } from '@services/models';
import { Model } from 'mongoose';
import { IUserRepository } from './user.repository.interface';

export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(MongoUser.name) private rolesModel: Model<UserDocument>
  ) {}
  async findOne(value: IDatabaseQuey<IUser>): Promise<IUser> {
    return await this.rolesModel.findOne({
      filter: value.filter,
    });
  }
  async store(value: IUser): Promise<IUser> {
    return (await this.rolesModel.create(value)).toObject();
  }
}
