export default () => ({
  api: {
    host: process.env.API_HOST || 'http://localhost',
    port: process.env.API_PORT || 3000,
    prefix: process.env.API_PREFIX || 'api/v1',
  },
  db: {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT || 5432,
    username: process.env.DB_USERNAME || 'nestjs',
    password: process.env.DB_PASSWORD || 'nestjs',
    database: process.env.DB_NAME || 'nestjs',
    synchronize: (process.env.DB_SYNCHRONIZE || 'true') === 'true',
    logging: (process.env.DB_LOGGING || 'true') === 'true',
    entities: [ __dirname + '/**/*.entity.{ts,js}' ],
  },
  auth: {
    enabled: (process.env.AUTH_ENABLED || 'true') === 'true',
    jwt: {
      secret: process.env.JWT_SECRET || 'secret',
      expires: process.env.JWT_EXPIRES || '30m',
    },
  },
});
