import { Role } from './user-role.enum';

// User response object
export class UserRO {
  id: string;
  username: string;
  name: string;
  role: Role;
  created: Date;
  updated: Date;
}
