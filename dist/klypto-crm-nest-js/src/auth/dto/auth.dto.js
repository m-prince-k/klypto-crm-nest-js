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
exports.ProfileResponseDto = exports.UserOrganizationResponseDto = exports.LogoutResponseDto = exports.AuthTokensResponseDto = exports.LoginDto = exports.SignupDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SignupDto {
    email;
    password;
    fullName;
    organizationName;
}
exports.SignupDto = SignupDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user@example.com',
        description: 'The email of the user',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SignupDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Password123!',
        description: 'The password (min 6 characters)',
        minLength: 6,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], SignupDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'John Doe',
        description: 'The full name of the user',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SignupDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Klypto Corp',
        description: 'The name of the organization',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SignupDto.prototype, "organizationName", void 0);
class LoginDto {
    email;
    password;
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user@example.com',
        description: 'The email of the user',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Password123!',
        description: 'The password of the user',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class AuthTokensResponseDto {
    accessToken;
    refreshToken;
    roles;
    role;
}
exports.AuthTokensResponseDto = AuthTokensResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access-token',
        description: 'JWT access token',
    }),
    __metadata("design:type", String)
], AuthTokensResponseDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh-token',
        description: 'JWT refresh token',
    }),
    __metadata("design:type", String)
], AuthTokensResponseDto.prototype, "refreshToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['SUPER_ADMIN'],
        required: false,
        description: 'Assigned role names for the user',
    }),
    __metadata("design:type", Array)
], AuthTokensResponseDto.prototype, "roles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'SUPER_ADMIN',
        required: false,
        description: 'Single assigned role at signup bootstrap',
    }),
    __metadata("design:type", String)
], AuthTokensResponseDto.prototype, "role", void 0);
class LogoutResponseDto {
    message;
}
exports.LogoutResponseDto = LogoutResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Logged out successfully',
    }),
    __metadata("design:type", String)
], LogoutResponseDto.prototype, "message", void 0);
class UserOrganizationResponseDto {
    id;
    name;
}
exports.UserOrganizationResponseDto = UserOrganizationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clxabc123org' }),
    __metadata("design:type", String)
], UserOrganizationResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Klypto Corp' }),
    __metadata("design:type", String)
], UserOrganizationResponseDto.prototype, "name", void 0);
class ProfileResponseDto {
    id;
    email;
    fullName;
    organization;
    roles;
    isActive;
    createdAt;
}
exports.ProfileResponseDto = ProfileResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clxabc123user' }),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user@example.com' }),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: UserOrganizationResponseDto }),
    __metadata("design:type", UserOrganizationResponseDto)
], ProfileResponseDto.prototype, "organization", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['SUPER_ADMIN'] }),
    __metadata("design:type", Array)
], ProfileResponseDto.prototype, "roles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ProfileResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-09T06:30:00.000Z' }),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "createdAt", void 0);
//# sourceMappingURL=auth.dto.js.map