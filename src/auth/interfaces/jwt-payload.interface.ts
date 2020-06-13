import {Role} from '../../users/interfaces';

export interface JwtPayload {
  id: string;
  username: string;
  role: Role;
}
