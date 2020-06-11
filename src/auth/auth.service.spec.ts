import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {Test, TestingModule} from '@nestjs/testing';
import {UserModule} from '../user/user.module';
import {AuthService} from './auth.service';
import {JwtStrategy} from './strategies/jwt.strategy';
import {LocalStrategy} from './strategies/local.strategy';

import {configuration} from '../config/configuration';

const config = configuration();

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
          secret: config.auth.jwt.secret,
          signOptions: {expiresIn: config.auth.jwt.expiresIn},
        }),
      ],
      providers: [AuthService, LocalStrategy, JwtStrategy],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});