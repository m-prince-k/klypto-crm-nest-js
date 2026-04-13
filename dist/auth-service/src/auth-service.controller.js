"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServiceController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_service_1 = require("./auth-service.service");
const prisma_service_1 = require("./prisma/prisma.service");
const swagger_1 = require("@nestjs/swagger");
let AuthServiceController = class AuthServiceController {
    authServiceService;
    prisma;
    constructor(authServiceService, prisma) {
        this.authServiceService = authServiceService;
        this.prisma = prisma;
    }
    getHello() {
        return this.authServiceService.getHello();
    }
    async countUsers() {
        const count = await this.prisma.authUser.count();
        return { count };
    }
};
exports.AuthServiceController = AuthServiceController;
__decorate([
    (0, common_1.Get)('hello'),
    (0, swagger_1.ApiOperation)({ summary: 'Basic hello world' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AuthServiceController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('count'),
    (0, swagger_1.ApiOperation)({ summary: 'Count auth users in database' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthServiceController.prototype, "countUsers", null);
exports.AuthServiceController = AuthServiceController = __decorate([
    (0, swagger_1.ApiTags)('Auth-Test'),
    (0, common_1.Controller)('auth-test'),
    __metadata("design:paramtypes", [auth_service_service_1.AuthServiceService,
        prisma_service_1.PrismaService])
], AuthServiceController);
//# sourceMappingURL=auth-service.controller.js.map