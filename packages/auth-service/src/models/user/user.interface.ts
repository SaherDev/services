export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  roles?: string[];
  isActive?: boolean;
}
