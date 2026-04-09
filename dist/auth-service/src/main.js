"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const auth_service_module_1 = require("./auth-service.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(auth_service_module_1.AuthServiceModule);
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Auth Service')
        .setDescription('The Authentication Service API documentation')
        .setVersion('1.0')
        .addTag('Auth')
        .addServer(`http://localhost:3002`, 'Local Environment')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'JWT', in: 'header' }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(3002);
    console.log(`Auth Service is running on: http://localhost:3002/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map