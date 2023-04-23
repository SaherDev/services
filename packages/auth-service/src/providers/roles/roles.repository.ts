import { IRole, MongoRole, RoleDocument } from '@/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IDatabaseQuey } from '@services/models';
import { Model } from 'mongoose';
import { IRolesRepository } from './roles.repository.interface';

@Injectable()
export class RolesRepository implements IRolesRepository {
  constructor(
    @InjectModel(MongoRole.name) private rolesModel: Model<RoleDocument>
  ) {}
  async findOne(value: IDatabaseQuey<IRole>): Promise<IRole> {
    return await this.rolesModel.findOne({
      filter: value.filter,
    });
  }
  async store(value: IRole): Promise<IRole> {
    return (await this.rolesModel.create(value)).toObject();
  }
}
