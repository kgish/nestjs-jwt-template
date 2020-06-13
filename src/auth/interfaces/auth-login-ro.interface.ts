import {Role, UserRO} from '../../user/interfaces';

export class AuthLoginRO {
  user: {
    id: string;
    username: string;
    name: string;
    role: Role;
  }
  token: string;
}
