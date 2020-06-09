import {Global, Module} from '@nestjs/common';
import {UserModule} from '../user/user.module';
import {AuthService} from './auth/auth.service';
import {JwtStrategy} from './auth/jwt.strategy';

@Global()
@Module({
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
  imports: [UserModule]
})
export class SharedModule {
}
