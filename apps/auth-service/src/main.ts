import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Auth Service')
    .setDescription('The Authentication Service API documentation')
    .setVersion('1.0')
    .addTag('Auth')
    .addServer(`http://localhost:3002`, 'Local Environment')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'JWT', in: 'header' },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3002);
  console.log(`Auth Service is running on: http://localhost:3002/api/docs`);
}
bootstrap();
