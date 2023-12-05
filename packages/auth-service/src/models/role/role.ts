import { IRole } from './role.interface';

export class Role implements IRole {
  constructor(
    public id: string,
    public name: string,
    public permissions: string[]
  ) {}
}
