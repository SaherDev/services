import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationRequired, Serialize } from '@services/common';
import { CreateRoleDto, RoleDto, UpdateRoleDto } from './dto';
import { RoleService } from './role.service';

@Controller('role')
@ApiTags('role')
@AuthenticationRequired()
export class RoleController {
  constructor(private readonly rolesService: RoleService) {}

  @Post('role')
  @Serialize(RoleDto)
  createRole(@Body() role: CreateRoleDto): Promise<RoleDto> {
    return this.rolesService.createRole(role.name, role.permissions);
  }

  @Put(':id')
  @Serialize(RoleDto)
  updateRole(
    @Param('id') id: string,
    @Body() role: UpdateRoleDto
  ): Promise<RoleDto> {
    return this.rolesService.updateRole(id, role);
  }
}
