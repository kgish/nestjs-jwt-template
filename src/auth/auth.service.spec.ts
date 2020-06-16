import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {Test, TestingModule} from '@nestjs/testing';
import {UsersModule} from '../users';
import {AuthService} from './auth.service';
import {JwtStrategy,LocalStrategy} from './strategies';

import {configuration} from '../config';

const config = configuration();

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
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
