import {NestFactory} from '@nestjs/core';
import {Logger} from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

import {HttpExceptionFilter} from './shared';
import {configuration} from './config';

import {AppModule} from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const config = configuration();
  logger.log(`config='${JSON.stringify(config)}'`);

  const app = await NestFactory.create(AppModule, {
    logger: config.api.logger.enabled ? config.api.logger.levels : false
  });

  const host = config.api.host;
  const port = config.api.port;
  const prefix = config.api.prefix;
  const hostDomain = config.api.environment === 'development' ? `${host}:${port}` : host;

  // Swagger
  const server = `${hostDomain}/${prefix}`;
  const swaggerOptions = new DocumentBuilder()
    .setTitle(config.swagger.title)
    .setDescription(config.swagger.description)
    .setVersion(config.swagger.version)
    .setTermsOfService(config.swagger.termsOfService)
    .setContact(config.swagger.contact.name, config.swagger.contact.url, config.swagger.contact.email)
    .setLicense(config.swagger.license.description, config.swagger.license.description)
    .addServer(server)
    .setExternalDoc(config.swagger.externalDoc.description, config.swagger.externalDoc.url)
    .addTag('root')
    .addTag('posts')
    .addTag('users')
    // TODO .addBearerAuth('Authorization', 'header')
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerOptions);
  const swaggerDir = `${prefix}/docs`;
  const swaggerJson = `${swaggerDir}/swagger.json`;
  const swaggerUrl = `${hostDomain}/${swaggerJson}`;

  app.use(swaggerJson, (req, res) => {
    res.send(swaggerDoc);
  });

  SwaggerModule.setup(swaggerDir, app, swaggerDoc, {
    swaggerUrl,
    swaggerOptions: {
      docExpansion: config.swagger.options.docExpansion,
      filter: config.swagger.options.filter,
      showRequestDuration: config.swagger.options.showRequestDuration
    },
  });

  app.setGlobalPrefix(prefix);
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors();

  await app.listen(port);

  logger.log(`Server running on ${hostDomain}/${prefix}`);
}

bootstrap();
