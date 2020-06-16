import {Role} from '../../users';

export interface JwtPayload {
  id: string;
  username: string;
  role: Role;
}
