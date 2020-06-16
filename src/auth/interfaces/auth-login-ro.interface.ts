import {Role} from '../../users';

export class AuthLoginRO {
  user: {
    id: string;
    username: string;
    name: string;
    role: Role;
  }
  token: string;
}
