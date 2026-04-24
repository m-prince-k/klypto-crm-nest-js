import { NestFactory } from '@nestjs/core';
import { AdminApiModule } from './admin-api.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AdminApiModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Admin API')
    .setDescription('The Admin Dashboard API documentation')
    .setVersion('1.0')
    .addTag('Admin')
    .addServer(`http://localhost:3001`, 'Local Environment')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3001);
  console.log(`Admin API is running on: http://localhost:3001/api/docs`);
}
bootstrap();
