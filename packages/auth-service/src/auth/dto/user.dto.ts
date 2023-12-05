import { Expose } from 'class-transformer';
export class UserDto {
  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  userName: string;
}
