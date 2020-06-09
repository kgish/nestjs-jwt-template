require('dotenv').config();

export const configuration = () => ({
  api: {
    host: process.env.API_HOST || 'http://localhost',
    port: process.env.API_PORT || 3000,
    prefix: process.env.API_PREFIX || 'api/v1',
    environment: process.env.NODE_ENV || 'development'
  },
  db: {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT || 5432,
    username: process.env.DB_USERNAME || 'nestjs',
    password: process.env.DB_PASSWORD || 'nestjs',
    database: process.env.DB_NAME || 'nestjs',
    synchronize: (process.env.DB_SYNCHRONIZE || 'true') === 'true',
    logging: (process.env.DB_LOGGING || 'true') === 'true',
  },
  auth: {
    enabled: (process.env.AUTH_ENABLED || 'true') === 'true',
    jwt: {
      secret: process.env.JWT_SECRET || 'secret',
      expiresIn: process.env.JWT_EXPIRES || '30m',
    },
  },
  swagger: {
    title: process.env.SWAGGER_TITLE || 'title',
    description: process.env.SWAGGER_DESCRIPTION || 'description',
    version: process.env.SWAGGER_VERSION || '0.0.1',
    termsOfService: process.env.SWAGGER_TERMS_OF_SERVICE || 'terms_of_service',
    contact: {
      name: process.env.SWAGGER_CONTACT_NAME || 'contact_name',
      email: process.env.SWAGGER_CONTACT_EMAIL || 'contact_email',
      url: process.env.SWAGGER_CONTACT_URL || 'contact_url'
    },
    license: {
      description: process.env.SWAGGER_LICENSE_DESCRIPTION || 'license_description',
      url: process.env.SWAGGER_LICENSE_URL || 'license_url'
    },
    externalDoc: {
      description: process.env.SWAGGER_EXTERNAL_DOC_DESCRIPTION || 'external_doc_description',
      url: process.env.SWAGGER_EXTERNAL_DOC_URL || 'external_doc_url'
    },
    options: {
      docExpansion: process.env.SWAGGER_OPTIONS_DOC_EXPANSION || 'list',
      filter: (process.env.SWAGGER_OPTIONS_FILTER || 'true') === 'true',
      showRequestDuration: (process.env.SWAGGER_OPTIONS_SHOW_REQUEST_DURATION || 'true') === 'true'
    }
  }
});
