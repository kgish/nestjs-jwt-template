import {Role} from '../../user/interfaces';

export interface JwtPayload {
  id: string;
  username: string;
  role: Role;
}
