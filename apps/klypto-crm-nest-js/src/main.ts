import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { isOriginAllowed } from './common/cors-origin.util';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  // Serve static files from the uploads directory
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // Enable CORS for frontend communication
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      callback(null, isOriginAllowed(origin));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  });

  // Set global prefix for all APIs, but specifically exclude ZKTeco ADMS routes
  // because hardware devices are hardcoded to test the root `/iclock` paths.
  app.setGlobalPrefix('api', {
    exclude: ['iclock', 'iclock/(.*)'],
  });
  // Enable global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors = []) => {
        const messages = validationErrors.flatMap((error) => {
          const constraints = error.constraints
            ? Object.values(error.constraints)
            : [];
          return constraints.length > 0
            ? constraints
            : [`${error.property} is invalid`];
        });

        return new BadRequestException({
          message: messages,
          error: 'Validation failed',
        });
      },
    }),
  );

  app.useGlobalFilters(new PrismaExceptionFilter());

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Klypto CRM API')
    .setDescription('The Klypto CRM ERP Portal API documentation')
    .setVersion('1.0')
    .addTag('Klypto')
    .addServer(
      `http://localhost:${process.env.PORT || 3000}`,
      'Local Environment',
    )
    .addServer('https://api.yourdomain.com', 'Production Environment') // Example production server
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name must match the one used in @ApiBearerAuth()
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Count total APIs across all paths and methods
  const totalApis = Object.values(document.paths).reduce(
    (acc, path) => acc + Object.keys(path).length,
    0,
  );

  // Dynamically update the description with total API count
  document.info.description = `**Total API Endpoints: ${totalApis}**\n\n${document.info.description}`;

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
      filter: true, // Adds a search bar to filter APIs
    },
    customSiteTitle: 'Klypto CRM API Docs',
  });

  const port = Number(process.env.PORT) || 3000;
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);
}
bootstrap();
