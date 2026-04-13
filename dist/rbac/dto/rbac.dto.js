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
exports.UserRolesResponseDto = exports.UserBasicDto = exports.UserRoleItemDto = exports.AssignRoleResponseDto = exports.RoleAssignmentDto = exports.RoleAssignmentRoleDto = exports.RoleAssignmentUserDto = exports.RoleResponseDto = exports.AssignRoleDto = exports.CreateRoleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateRoleDto {
    name;
    description;
}
exports.CreateRoleDto = CreateRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'SALES_MANAGER',
        description: 'Unique role name (stored as uppercase)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Role for managing sales operations',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "description", void 0);
class AssignRoleDto {
    userId;
    roleName;
}
exports.AssignRoleDto = AssignRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'ckxxxxxxxxxxxxxxxxxxxxxxx',
        description: 'User ID receiving the role',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AssignRoleDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'SALES_MANAGER',
        description: 'Role name to assign',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AssignRoleDto.prototype, "roleName", void 0);
class RoleResponseDto {
    id;
    name;
    description;
    isSystem;
    assignedUsersCount;
    createdAt;
    updatedAt;
}
exports.RoleResponseDto = RoleResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ckxxxxxxxxxxxxxxxxxxxxxxx' }),
    __metadata("design:type", String)
], RoleResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SALES_MANAGER' }),
    __metadata("design:type", String)
], RoleResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Role for managing sales operations',
        nullable: true,
    }),
    __metadata("design:type", Object)
], RoleResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], RoleResponseDto.prototype, "isSystem", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    __metadata("design:type", Number)
], RoleResponseDto.prototype, "assignedUsersCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-01T10:00:00.000Z' }),
    __metadata("design:type", Date)
], RoleResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-02T10:00:00.000Z' }),
    __metadata("design:type", Date)
], RoleResponseDto.prototype, "updatedAt", void 0);
class RoleAssignmentUserDto {
    id;
    email;
    fullName;
}
exports.RoleAssignmentUserDto = RoleAssignmentUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ckxxxxxxxxxxxxxxxxxxxxxxx' }),
    __metadata("design:type", String)
], RoleAssignmentUserDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'john.doe@company.com' }),
    __metadata("design:type", String)
], RoleAssignmentUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    __metadata("design:type", String)
], RoleAssignmentUserDto.prototype, "fullName", void 0);
class RoleAssignmentRoleDto {
    id;
    name;
    description;
    isSystem;
    createdAt;
    updatedAt;
}
exports.RoleAssignmentRoleDto = RoleAssignmentRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ckxxxxxxxxxxxxxxxxxxxxxxx' }),
    __metadata("design:type", String)
], RoleAssignmentRoleDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SALES_MANAGER' }),
    __metadata("design:type", String)
], RoleAssignmentRoleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Role for managing sales operations',
        nullable: true,
    }),
    __metadata("design:type", Object)
], RoleAssignmentRoleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], RoleAssignmentRoleDto.prototype, "isSystem", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-01T10:00:00.000Z' }),
    __metadata("design:type", Date)
], RoleAssignmentRoleDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-02T10:00:00.000Z' }),
    __metadata("design:type", Date)
], RoleAssignmentRoleDto.prototype, "updatedAt", void 0);
class RoleAssignmentDto {
    id;
    userId;
    roleId;
    assignedById;
    createdAt;
    updatedAt;
    user;
    role;
}
exports.RoleAssignmentDto = RoleAssignmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ckxxxxxxxxxxxxxxxxxxxxxxx' }),
    __metadata("design:type", String)
], RoleAssignmentDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ckxxxxxxxxxxxxxxxxxxxxxxx' }),
    __metadata("design:type", String)
], RoleAssignmentDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ckxxxxxxxxxxxxxxxxxxxxxxx' }),
    __metadata("design:type", String)
], RoleAssignmentDto.prototype, "roleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ckxxxxxxxxxxxxxxxxxxxxxxx' }),
    __metadata("design:type", String)
], RoleAssignmentDto.prototype, "assignedById", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-01T10:00:00.000Z' }),
    __metadata("design:type", Date)
], RoleAssignmentDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-02T10:00:00.000Z' }),
    __metadata("design:type", Date)
], RoleAssignmentDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: RoleAssignmentUserDto }),
    __metadata("design:type", RoleAssignmentUserDto)
], RoleAssignmentDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: RoleAssignmentRoleDto }),
    __metadata("design:type", RoleAssignmentRoleDto)
], RoleAssignmentDto.prototype, "role", void 0);
class AssignRoleResponseDto {
    message;
    assignment;
}
exports.AssignRoleResponseDto = AssignRoleResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Role assigned successfully' }),
    __metadata("design:type", String)
], AssignRoleResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: RoleAssignmentDto }),
    __metadata("design:type", RoleAssignmentDto)
], AssignRoleResponseDto.prototype, "assignment", void 0);
class UserRoleItemDto {
    assignmentId;
    roleId;
    roleName;
    description;
    isSystem;
    assignedAt;
    assignedBy;
}
exports.UserRoleItemDto = UserRoleItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ckxxxxxxxxxxxxxxxxxxxxxxx' }),
    __metadata("design:type", String)
], UserRoleItemDto.prototype, "assignmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ckxxxxxxxxxxxxxxxxxxxxxxx' }),
    __metadata("design:type", String)
], UserRoleItemDto.prototype, "roleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SALES_MANAGER' }),
    __metadata("design:type", String)
], UserRoleItemDto.prototype, "roleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Role for managing sales operations',
        nullable: true,
    }),
    __metadata("design:type", Object)
], UserRoleItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], UserRoleItemDto.prototype, "isSystem", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-01T10:00:00.000Z' }),
    __metadata("design:type", Date)
], UserRoleItemDto.prototype, "assignedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: RoleAssignmentUserDto, nullable: true }),
    __metadata("design:type", Object)
], UserRoleItemDto.prototype, "assignedBy", void 0);
class UserBasicDto {
    id;
    email;
    fullName;
}
exports.UserBasicDto = UserBasicDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ckxxxxxxxxxxxxxxxxxxxxxxx' }),
    __metadata("design:type", String)
], UserBasicDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'john.doe@company.com' }),
    __metadata("design:type", String)
], UserBasicDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    __metadata("design:type", String)
], UserBasicDto.prototype, "fullName", void 0);
class UserRolesResponseDto {
    user;
    roles;
}
exports.UserRolesResponseDto = UserRolesResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: UserBasicDto }),
    __metadata("design:type", UserBasicDto)
], UserRolesResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [UserRoleItemDto] }),
    __metadata("design:type", Array)
], UserRolesResponseDto.prototype, "roles", void 0);
//# sourceMappingURL=rbac.dto.js.map