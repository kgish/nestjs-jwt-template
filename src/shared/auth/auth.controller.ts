import {Controller, Logger} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private logger: Logger;

  constructor(private readonly authService: AuthService) {
    this.logger = new Logger('AuthController');
    this.logger.log('constructor()');
  }
}
