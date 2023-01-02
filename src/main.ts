import 'dotenv/config';

import { appConfig } from '@configs/app.config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { graphqlUploadExpress } from 'graphql-upload';
import helmet from 'helmet';

import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    credentials: true,
    exposedHeaders: 'Content-Disposition',
    origin: appConfig.originConfig,
  });

  // Middlewares
  app.use(
    helmet({
      crossOriginEmbedderPolicy: appConfig.isProductionEnv,
      contentSecurityPolicy: appConfig.isProductionEnv,
    }),
  );
  app.use(cookieParser());

  // GrpahQL Upload
  app.use(
    graphqlUploadExpress({
      maxFileSize: 50000000,
      maxFiles: 10,
    }),
  );

  // Pipes
  app.useGlobalPipes(new ValidationPipe());

  // Swagger
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle(`${process.env.APP_NAME} API`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
