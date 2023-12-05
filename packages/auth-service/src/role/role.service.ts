import { IRole } from '@/models';
import { IRolesRetriever, ROLES_RETRIEVER } from '@/providers';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { uuid } from '@services/common';

@Injectable()
export class RoleService {
  private logger = new Logger(RoleService.name);

  constructor(
    @Inject(ROLES_RETRIEVER) private readonly rolesRetriever: IRolesRetriever
  ) {}

  async updateRole(id: Readonly<string>, role: Partial<IRole>): Promise<IRole> {
    if (!id) {
      this.logger.error(
        `updateRole >> field are missing, aborting. >> id = ${id}, role = ${JSON.stringify(
          role
        )}`
      );

      throw new BadRequestException('fields are missing');
    }

    let foundRole: IRole;
    let foundRoleError: any = null;

    try {
      foundRole = await this.findRole({
        id,
      });
    } catch (error) {
      foundRoleError = error;
    }

    if (foundRoleError) {
      this.logger.error(
        `updateRole >> error while retrieving role by name, aborting. >> error = ${JSON.parse(
          foundRoleError
        )} `
      );

      throw new InternalServerErrorException("couldn't update  role");
    }

    if (!foundRole) throw new BadRequestException('role not found');

    let updateRoleResponse: IRole;
    let updateRoleError: any = null;

    try {
      if (role.permissions) foundRole.permissions.push(...role.permissions);
      updateRoleResponse = await this.rolesRetriever.updateOne(
        {
          id,
        },
        {
          ...role,
          permissions: foundRole.permissions,
        }
      );
    } catch (error) {
      updateRoleError = error;
    }

    if (!updateRoleResponse || updateRoleError) {
      this.logger.error(
        `updateRole >> error while updating, aborting. >> error = ${JSON.parse(
          updateRoleError
        )} `
      );

      throw new InternalServerErrorException("couldn't update new role");
    }
    return updateRoleResponse;
  }

  async createRole(
    name: Readonly<string>,
    permissions: string[]
  ): Promise<IRole> {
    let foundRole: IRole;
    let foundRoleError: any = null;

    try {
      foundRole = await this.findRole({
        name,
      });
    } catch (error) {
      foundRoleError = error;
    }

    if (foundRoleError) {
      this.logger.error(
        `createRoles >> error while retrieving role by name, aborting. >> error = ${JSON.parse(
          foundRoleError
        )} `
      );

      throw new InternalServerErrorException("couldn't create new role");
    }
    if (foundRole) throw new BadRequestException('this role already created');

    let roleCreateResponse: IRole;
    let roleCreateResponseError: any = null;

    try {
      roleCreateResponse = await this.rolesRetriever.storeRole({
        id: uuid(),
        name,
        permissions: Array.from(new Set<string>(permissions)),
      });
    } catch (error) {
      roleCreateResponseError = error;
    }

    if (roleCreateResponseError) {
      this.logger.error(
        `createRoles >> error while retrieving role by name, aborting. >> error = ${JSON.parse(
          roleCreateResponseError
        )} `
      );

      throw new InternalServerErrorException("couldn't create new role");
    }

    return roleCreateResponse;
  }

  private async findRole(value: Partial<IRole>): Promise<IRole> {
    let response: IRole;
    let error: any = null;

    try {
      response = await this.rolesRetriever.findRole(value);
    } catch (error) {}

    if (error || !response) {
      return null;
    }

    return response;
  }
}
