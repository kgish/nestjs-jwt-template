import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const host = AppModule.host;
  const port = AppModule.port;
  const prefix = AppModule.prefix;
  const hostDomain = AppModule.environment === 'development' ? `${ host }:${ port }` : host;

  // Swagger
  const server = `${hostDomain}/${prefix}`
  const swaggerOptions = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('A simple')
    .setVersion('0.0.1')
    // setTermsOfService(termsOfService: string): this;
    .setContact('Kiffin Gish', 'http://gishtech.com', 'kiffin.gish@planet.nl')
    .setLicense('MIT', 'https://github.com/kgish/nestjs-jwt-template/blob/master/LICENSE.md')
    .addServer(server)
    // setExternalDoc(description: string, url: string): this;
    .setExternalDoc('README', 'https://github.com/kgish/nestjs-jwt-template/blob/master/README.md')
    .addTag('root')
    .addTag('operators')
    .addTag('users')
    // addSecurity(name: string, options: SecuritySchemeObject): this;
    // addSecurityRequirements(name: string, requirements?: string[]): this;
    // TODO .addBearerAuth('Authorization', 'header')
    .addBearerAuth()
    // addOAuth2(options?: SecuritySchemeObject, name?: string): this;
    // addApiKey(options?: SecuritySchemeObject, name?: string): this;
    // addBasicAuth(options?: SecuritySchemeObject, name?: string): this;
    // addCookieAuth(cookieName?: string, options?: SecuritySchemeObject, securityName?: string): this;
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerOptions);
  const swaggerDir = `${ prefix }/docs`;
  const swaggerJson = `${ swaggerDir }/swagger.json`;
  const swaggerUrl = `${ hostDomain }/${ swaggerJson }`;

  app.use(swaggerJson, (req, res) => {
    res.send(swaggerDoc);
  });

  SwaggerModule.setup(swaggerDir, app, swaggerDoc, {
    swaggerUrl,
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  });

  app.setGlobalPrefix(prefix);
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors();

  await app.listen(port);

  Logger.log(`Server running on ${ hostDomain }/${ prefix }`, 'bootstrap');
}

bootstrap();
