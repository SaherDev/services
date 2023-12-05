import { IRole, MongoRole, Role, RoleDocument } from '@/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { generateMongoQuery } from '@services/common';
import { IDatabaseFindManyQuey, IDatabaseQuey } from '@services/models';
import { Model } from 'mongoose';
import { IRolesRepository } from './roles.repository.interface';

@Injectable()
export class RolesRepository implements IRolesRepository {
  constructor(
    @InjectModel(MongoRole.name) private rolesModel: Model<RoleDocument>
  ) {}
  async findMany(value: IDatabaseFindManyQuey<IRole>): Promise<IRole[]> {
    const query = generateMongoQuery(value);
    const response = await this.rolesModel.find(query);
    return response.map((db) => this.dbToObject(db));
  }
  async findOne(value: IDatabaseQuey<IRole>): Promise<IRole> {
    const response = await this.rolesModel.findOne(value.filter);

    return this.dbToObject(response);
  }

  async store(value: IRole): Promise<IRole> {
    const response = await this.rolesModel.create(value);

    return this.dbToObject(response);
  }

  async updateOne(
    query: IDatabaseQuey<IRole>,
    value: Partial<IRole>
  ): Promise<IRole> {
    const response = await this.rolesModel.findOneAndUpdate(
      query.filter,
      value,
      {
        new: true,
      }
    );

    return this.dbToObject(response);
  }

  dbToObject(doc: RoleDocument): IRole {
    if (!doc) return null;
    return new Role(doc.id, doc.name, doc.permissions);
  }
}
