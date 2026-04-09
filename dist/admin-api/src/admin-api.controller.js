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
exports.AdminApiController = void 0;
const common_1 = require("@nestjs/common");
const admin_api_service_1 = require("./admin-api.service");
const prisma_service_1 = require("./prisma/prisma.service");
const swagger_1 = require("@nestjs/swagger");
let AdminApiController = class AdminApiController {
    adminApiService;
    prisma;
    constructor(adminApiService, prisma) {
        this.adminApiService = adminApiService;
        this.prisma = prisma;
    }
    getHello() {
        return this.adminApiService.getHello();
    }
    async countAdmins() {
        const count = await this.prisma.admin.count();
        return { count };
    }
};
exports.AdminApiController = AdminApiController;
__decorate([
    (0, common_1.Get)('hello'),
    (0, swagger_1.ApiOperation)({ summary: 'Basic hello world' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AdminApiController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('count'),
    (0, swagger_1.ApiOperation)({ summary: 'Count admins in database' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminApiController.prototype, "countAdmins", null);
exports.AdminApiController = AdminApiController = __decorate([
    (0, swagger_1.ApiTags)('Admin-Test'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_api_service_1.AdminApiService,
        prisma_service_1.PrismaService])
], AdminApiController);
//# sourceMappingURL=admin-api.controller.js.map