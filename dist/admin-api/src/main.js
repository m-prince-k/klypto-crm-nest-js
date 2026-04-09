"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const admin_api_module_1 = require("./admin-api.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(admin_api_module_1.AdminApiModule);
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Admin API')
        .setDescription('The Admin Dashboard API documentation')
        .setVersion('1.0')
        .addTag('Admin')
        .addServer(`http://localhost:3001`, 'Local Environment')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'JWT', in: 'header' }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(3001);
    console.log(`Admin API is running on: http://localhost:3001/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map