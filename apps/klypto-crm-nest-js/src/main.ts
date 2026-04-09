import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global prefix for all APIs
  app.setGlobalPrefix('api');

  // Enable global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Klypto CRM API')
    .setDescription('The Klypto CRM ERP Portal API documentation')
    .setVersion('1.0')
    .addTag('Klypto')
    .addServer(`http://localhost:${process.env.PORT || 3000}`, 'Local Environment')
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

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
