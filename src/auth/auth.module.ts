import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';

import {UsersModule} from '../users/users.module';
import {AuthService} from './auth.service';
import {JwtStrategy, LocalStrategy} from './strategies';

import {configuration} from '../config';

const config = configuration();

@Module({
  imports: [
    UsersModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false
    }),
    JwtModule.register({
      secret: config.auth.jwt.secret,
      signOptions: {expiresIn: config.auth.jwt.expiresIn},
    }),
  ],
  controllers: [],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {
}
