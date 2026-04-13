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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const access_token_guard_1 = require("../auth/guards/access-token.guard");
const roles_guard_1 = require("../auth/roles/roles.guard");
const roles_decorator_1 = require("../auth/roles/roles.decorator");
const system_role_enum_1 = require("../auth/roles/system-role.enum");
const rbac_dto_1 = require("./dto/rbac.dto");
const rbac_service_1 = require("./rbac.service");
let RbacController = class RbacController {
    rbacService;
    constructor(rbacService) {
        this.rbacService = rbacService;
    }
    createRole(dto) {
        return this.rbacService.createRole(dto);
    }
    listRoles() {
        return this.rbacService.listRoles();
    }
    assignRole(dto, req) {
        const assignedById = req.user?.sub;
        if (!assignedById) {
            throw new common_1.UnauthorizedException('Invalid user context');
        }
        return this.rbacService.assignRole(dto, assignedById);
    }
    getUserRoles(userId) {
        return this.rbacService.getUserRoles(userId);
    }
};
exports.RbacController = RbacController;
__decorate([
    (0, common_1.Post)('roles'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new role (Super Admin only)' }),
    (0, swagger_1.ApiBody)({ type: rbac_dto_1.CreateRoleDto }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Role created successfully',
        type: rbac_dto_1.RoleResponseDto,
    }),
    (0, swagger_1.ApiConflictResponse)({ description: 'Role already exists' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden resource' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rbac_dto_1.CreateRoleDto]),
    __metadata("design:returntype", void 0)
], RbacController.prototype, "createRole", null);
__decorate([
    (0, common_1.Get)('roles'),
    (0, swagger_1.ApiOperation)({ summary: 'List all roles (Super Admin only)' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Roles fetched successfully',
        type: [rbac_dto_1.RoleResponseDto],
    }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden resource' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RbacController.prototype, "listRoles", null);
__decorate([
    (0, common_1.Post)('roles/assign'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign role to user (Super Admin only)' }),
    (0, swagger_1.ApiBody)({ type: rbac_dto_1.AssignRoleDto }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Role assigned successfully',
        type: rbac_dto_1.AssignRoleResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User or role not found' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden resource' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Invalid user context' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rbac_dto_1.AssignRoleDto, Object]),
    __metadata("design:returntype", void 0)
], RbacController.prototype, "assignRole", null);
__decorate([
    (0, common_1.Get)('users/:userId/roles'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all roles for a user (Super Admin only)' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'User roles fetched successfully',
        type: rbac_dto_1.UserRolesResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden resource' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RbacController.prototype, "getUserRoles", null);
exports.RbacController = RbacController = __decorate([
    (0, swagger_1.ApiTags)('RBAC'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(system_role_enum_1.SystemRole.SUPER_ADMIN),
    (0, common_1.Controller)('rbac'),
    __metadata("design:paramtypes", [rbac_service_1.RbacService])
], RbacController);
//# sourceMappingURL=rbac.controller.js.map