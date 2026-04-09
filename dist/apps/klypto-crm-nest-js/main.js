/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/klypto-crm-nest-js/src/app.controller.ts"
/*!*******************************************************!*\
  !*** ./apps/klypto-crm-nest-js/src/app.controller.ts ***!
  \*******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const app_service_1 = __webpack_require__(/*! ./app.service */ "./apps/klypto-crm-nest-js/src/app.service.ts");
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ },

/***/ "./apps/klypto-crm-nest-js/src/app.module.ts"
/*!***************************************************!*\
  !*** ./apps/klypto-crm-nest-js/src/app.module.ts ***!
  \***************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const mailer_1 = __webpack_require__(/*! @nestjs-modules/mailer */ "@nestjs-modules/mailer");
const app_controller_1 = __webpack_require__(/*! ./app.controller */ "./apps/klypto-crm-nest-js/src/app.controller.ts");
const app_service_1 = __webpack_require__(/*! ./app.service */ "./apps/klypto-crm-nest-js/src/app.service.ts");
const prisma_module_1 = __webpack_require__(/*! ./prisma/prisma.module */ "./apps/klypto-crm-nest-js/src/prisma/prisma.module.ts");
const auth_module_1 = __webpack_require__(/*! ./auth/auth.module */ "./apps/klypto-crm-nest-js/src/auth/auth.module.ts");
const users_module_1 = __webpack_require__(/*! ./users/users.module */ "./apps/klypto-crm-nest-js/src/users/users.module.ts");
const mail_module_1 = __webpack_require__(/*! ./mail/mail.module */ "./apps/klypto-crm-nest-js/src/mail/mail.module.ts");
const rbac_module_1 = __webpack_require__(/*! ./rbac/rbac.module */ "./apps/klypto-crm-nest-js/src/rbac/rbac.module.ts");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            rbac_module_1.RbacModule,
            users_module_1.UsersModule,
            mail_module_1.MailModule,
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: process.env.SMTP_HOST || 'smtp.example.com',
                    port: Number(process.env.SMTP_PORT) || 587,
                    auth: {
                        user: process.env.SMTP_USER || 'user@example.com',
                        pass: process.env.SMTP_PASS || 'password',
                    },
                },
                defaults: {
                    from: '"No Reply" <noreply@klyptocrm.com>',
                },
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);


/***/ },

/***/ "./apps/klypto-crm-nest-js/src/app.service.ts"
/*!****************************************************!*\
  !*** ./apps/klypto-crm-nest-js/src/app.service.ts ***!
  \****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ },

/***/ "./apps/klypto-crm-nest-js/src/auth/auth.controller.ts"
/*!*************************************************************!*\
  !*** ./apps/klypto-crm-nest-js/src/auth/auth.controller.ts ***!
  \*************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./apps/klypto-crm-nest-js/src/auth/auth.service.ts");
const auth_dto_1 = __webpack_require__(/*! ./dto/auth.dto */ "./apps/klypto-crm-nest-js/src/auth/dto/auth.dto.ts");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const access_token_guard_1 = __webpack_require__(/*! ./guards/access-token.guard */ "./apps/klypto-crm-nest-js/src/auth/guards/access-token.guard.ts");
const refresh_token_guard_1 = __webpack_require__(/*! ./guards/refresh-token.guard */ "./apps/klypto-crm-nest-js/src/auth/guards/refresh-token.guard.ts");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    signup(signupDto) {
        return this.authService.signup(signupDto);
    }
    login(loginDto) {
        return this.authService.login(loginDto);
    }
    logout(req) {
        const userId = req.user?.sub;
        if (!userId) {
            throw new common_1.UnauthorizedException('Invalid user context');
        }
        return this.authService.logout(userId);
    }
    refresh(req) {
        const userId = req.user?.sub;
        const refreshToken = req.user?.refreshToken;
        if (!userId || !refreshToken) {
            throw new common_1.UnauthorizedException('Invalid user context');
        }
        return this.authService.refreshTokens(userId, refreshToken);
    }
    me(req) {
        const userId = req.user?.sub;
        if (!userId) {
            throw new common_1.UnauthorizedException('Invalid user context');
        }
        return this.authService.getProfile(userId);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('signup'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User successfully created' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Email already exists' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof auth_dto_1.SignupDto !== "undefined" && auth_dto_1.SignupDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login with email and password' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully logged in' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof auth_dto_1.LoginDto !== "undefined" && auth_dto_1.LoginDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Logout and invalidate refresh token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully logged out' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.UseGuards)(refresh_token_guard_1.RefreshTokenGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh access token using refresh token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tokens successfully refreshed' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get authenticated user profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile fetched successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "me", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ },

/***/ "./apps/klypto-crm-nest-js/src/auth/auth.module.ts"
/*!*********************************************************!*\
  !*** ./apps/klypto-crm-nest-js/src/auth/auth.module.ts ***!
  \*********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./apps/klypto-crm-nest-js/src/auth/auth.service.ts");
const auth_controller_1 = __webpack_require__(/*! ./auth.controller */ "./apps/klypto-crm-nest-js/src/auth/auth.controller.ts");
const users_module_1 = __webpack_require__(/*! ../users/users.module */ "./apps/klypto-crm-nest-js/src/users/users.module.ts");
const jwt_strategy_1 = __webpack_require__(/*! ./strategies/jwt.strategy */ "./apps/klypto-crm-nest-js/src/auth/strategies/jwt.strategy.ts");
const access_token_guard_1 = __webpack_require__(/*! ./guards/access-token.guard */ "./apps/klypto-crm-nest-js/src/auth/guards/access-token.guard.ts");
const refresh_token_guard_1 = __webpack_require__(/*! ./guards/refresh-token.guard */ "./apps/klypto-crm-nest-js/src/auth/guards/refresh-token.guard.ts");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule, passport_1.PassportModule, jwt_1.JwtModule.register({})],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            jwt_strategy_1.AccessTokenStrategy,
            jwt_strategy_1.RefreshTokenStrategy,
            access_token_guard_1.AccessTokenGuard,
            refresh_token_guard_1.RefreshTokenGuard,
        ],
        exports: [auth_service_1.AuthService, access_token_guard_1.AccessTokenGuard, refresh_token_guard_1.RefreshTokenGuard],
    })
], AuthModule);


/***/ },

/***/ "./apps/klypto-crm-nest-js/src/auth/auth.service.ts"
/*!**********************************************************!*\
  !*** ./apps/klypto-crm-nest-js/src/auth/auth.service.ts ***!
  \**********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const users_service_1 = __webpack_require__(/*! ../users/users.service */ "./apps/klypto-crm-nest-js/src/users/users.service.ts");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./apps/klypto-crm-nest-js/src/prisma/prisma.service.ts");
const bcrypt = __importStar(__webpack_require__(/*! bcryptjs */ "bcryptjs"));
let AuthService = class AuthService {
    usersService;
    jwtService;
    prisma;
    constructor(usersService, jwtService, prisma) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async signup(signupDto) {
        const existingUser = await this.usersService.findOneByEmail(signupDto.email);
        if (existingUser) {
            throw new common_1.ConflictException('User already exists');
        }
        const passwordHash = await bcrypt.hash(signupDto.password, 10);
        const organization = await this.prisma.organization.create({
            data: {
                name: signupDto.organizationName,
            },
        });
        const user = await this.usersService.create({
            email: signupDto.email,
            fullName: signupDto.fullName,
            passwordHash,
            organization: {
                connect: { id: organization.id },
            },
        });
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
    async login(loginDto) {
        const user = await this.usersService.findOneByEmail(loginDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const passwordMatches = await bcrypt.compare(loginDto.password, user.passwordHash);
        if (!passwordMatches) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
    async getProfile(userId) {
        if (!userId) {
            throw new common_1.UnauthorizedException('Invalid user context');
        }
        const user = await this.usersService.findOneById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            organization: user.organization,
            roles: user.roleAssignments?.map((assignment) => assignment.roleName) || [],
            isActive: user.isActive,
            createdAt: user.createdAt,
        };
    }
    async logout(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { hashedRefreshToken: null },
        });
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.usersService.findOneById(userId);
        if (!user || !user.hashedRefreshToken) {
            throw new common_1.UnauthorizedException('Access Denied');
        }
        const refreshTokenMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
        if (!refreshTokenMatches) {
            throw new common_1.UnauthorizedException('Access Denied');
        }
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
    async updateRefreshToken(userId, refreshToken) {
        const hashedRefreshToken = refreshToken
            ? await bcrypt.hash(refreshToken, 10)
            : null;
        await this.prisma.user.update({
            where: { id: userId },
            data: { hashedRefreshToken },
        });
    }
    async getTokens(userId, email) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({ sub: userId, email }, {
                secret: process.env.JWT_ACCESS_SECRET || 'access-secret',
                expiresIn: '15m',
            }),
            this.jwtService.signAsync({ sub: userId, email }, {
                secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
                expiresIn: '7d',
            }),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object, typeof (_c = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _c : Object])
], AuthService);


/***/ },

/***/ "./apps/klypto-crm-nest-js/src/auth/dto/auth.dto.ts"
/*!**********************************************************!*\
  !*** ./apps/klypto-crm-nest-js/src/auth/dto/auth.dto.ts ***!
  \**********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileResponseDto = exports.UserOrganizationResponseDto = exports.LogoutResponseDto = exports.AuthTokensResponseDto = exports.LoginDto = exports.SignupDto = void 0;
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
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


/***/ },

/***/ "./apps/klypto-crm-nest-js/src/auth/guards/access-token.guard.ts"
/*!***********************************************************************!*\
  !*** ./apps/klypto-crm-nest-js/src/auth/guards/access-token.guard.ts ***!
  \***********************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccessTokenGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
let AccessTokenGuard = class AccessTokenGuard extends (0, passport_1.AuthGuard)('jwt') {
};
exports.AccessTokenGuard = AccessTokenGuard;
exports.AccessTokenGuard = AccessTokenGuard = __decorate([
    (0, common_1.Injectable)()
], AccessTokenGuard);


/***/ },

/***/ "./apps/klypto-crm-nest-js/src/auth/guards/refresh-token.guard.ts"
/*!************************************************************************!*\
  !*** ./apps/klypto-crm-nest-js/src/auth/guards/refresh-token.guard.ts ***!
  \************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RefreshTokenGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
let RefreshTokenGuard = class RefreshTokenGuard extends (0, passport_1.AuthGuard)('jwt-refresh') {
};
exports.RefreshTokenGuard = RefreshTokenGuard;
exports.RefreshTokenGuard = RefreshTokenGuard = __decorate([
    (0, common_1.Injectable)()
], RefreshTokenGuard);


/***/ },

/***/ "./apps/klypto-crm-nest-js/src/auth/roles/roles.decorator.ts"
/*!*******************************************************************!*\
  !*** ./apps/klypto-crm-nest-js/src/auth/roles/roles.decorator.ts ***!
  \*******************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;


/***/ },

/***/ "./apps/klypto-crm-nest-js/src/auth/roles/roles.guard.ts"
/*!***************************************************************!*\
  !*** ./apps/klypto-crm-nest-js/src/auth/roles/roles.guard.ts ***!
  \***************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const prisma_service_1 = __webpack_require__(/*! ../../prisma/prisma.service */ "./apps/klypto-crm-nest-js/src/prisma/prisma.service.ts");
const roles_decorator_1 = __webpack_require__(/*! ./roles.decorator */ "./apps/klypto-crm-nest-js/src/auth/roles/roles.decorator.ts");
let RolesGuard = class RolesGuard {
    reflector;
    prisma;
    constructor(reflector, prisma) {
        this.reflector = reflector;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const userId = request.user?.sub;
        if (!userId) {
            throw new common_1.UnauthorizedException('Invalid user context');
        }
        const assignedRoles = await this.prisma.userRole.findMany({
            where: { userId },
            include: {
                role: true,
            },
        });
        const roleSet = new Set(assignedRoles.map((entry) => entry.role.name.toUpperCase()));
        return requiredRoles.some((role) => roleSet.has(role.toUpperCase()));
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object, typeof (_b = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _b : Object])
], RolesGuard);


/***/ },

/***/ "./apps/klypto-crm-nest-js/src/auth/roles/system-role.enum.ts"
/*!********************************************************************!*\
  !*** ./apps/klypto-crm-nest-js/src/auth/roles/system-role.enum.ts ***!
  \********************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SystemRole = void 0;
var SystemRole;
(function (SystemRole) {
    SystemRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    SystemRole["ADMIN"] = "ADMIN";
    SystemRole["MANAGER"] = "MANAGER";
    SystemRole["EMPLOYEE"] = "EMPLOYEE";
})(SystemRole || (exports.SystemRole = SystemRole = {}));


/***/ },

/***/ "./apps/klypto-crm-nest-js/src/auth/strategies/jwt.strategy.ts"
/*!*********************************************************************!*\
  !*** ./apps/klypto-crm-nest-js/src/auth/strategies/jwt.strategy.ts ***!
  \*********************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RefreshTokenStrategy = exports.AccessTokenStrategy = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const passport_jwt_1 = __webpack_require__(/*! passport-jwt */ "passport-jwt");
let AccessTokenStrategy = class AccessTokenStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_ACCESS_SECRET || 'access-secret',
        });
    }
    validate(payload) {
        return payload;
    }
};
exports.AccessTokenStrategy = AccessTokenStrategy;
exports.AccessTokenStrategy = AccessTokenStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AccessTokenStrategy);
let RefreshTokenStrategy = class RefreshTokenStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
            passReqToCallback: true,
        });
    }
    validate(req, payload) {
        const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
        return { ...payload, refreshToken };
    }
};
exports.RefreshTokenStrategy = RefreshTokenStrategy;
exports.RefreshTokenStrategy = RefreshTokenStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RefreshTokenStrategy);


/***/ },

/***/ "./apps/klypto-crm-nest-js/src/mail/mail.module.ts"
/*!*********************************************************!*\
  !*** ./apps/klypto-crm-nest-js/src/mail/mail.module.ts ***!
  \*********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MailModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mail_service_1 = __webpack_require__(/*! ./mail.service */ "./apps/klypto-crm-nest-js/src/mail/mail.service.ts");
let MailModule = class MailModule {
};
exports.MailModule = MailModule;
exports.MailModule = MailModule = __decorate([
    (0, common_1.Module)({
        providers: [mail_service_1.MailService],
    })
], MailModule);


/***/ },

/***/ "./apps/klypto-crm-nest-js/src/mail/mail.service.ts"
/*!**********************************************************!*\
  !*** ./apps/klypto-crm-nest-js/src/mail/mail.service.ts ***!
  \**********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MailService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mailer_1 = __webpack_require__(/*! @nestjs-modules/mailer */ "@nestjs-modules/mailer");
let MailService = class MailService {
    mailerService;
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async sendWelcomeEmail(email, fullName) {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: 'Welcome to Klypto CRM',
                template: './welcome',
                context: {
                    name: fullName,
                },
            });
            return true;
        }
        catch (error) {
            console.error('Email sending failed', error);
            return false;
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof mailer_1.MailerService !== "undefined" && mailer_1.MailerService) === "function" ? _a : Object])
], MailService);


/***/ },

/***/ "./apps/klypto-crm-nest-js/src/prisma/prisma.module.ts"
/*!*************************************************************!*\
  !*** ./apps/klypto-crm-nest-js/src/prisma/prisma.module.ts ***!
  \*************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ./prisma.service */ "./apps/klypto-crm-nest-js/src/prisma/prisma.service.ts");
let PrismaModule = class PrismaModule {
};
exports.PrismaModule = PrismaModule;
exports.PrismaModule = PrismaModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], PrismaModule);


/***/ },

/***/ "./apps/klypto-crm-nest-js/src/prisma/prisma.service.ts"
/*!**************************************************************!*\
  !*** ./apps/klypto-crm-nest-js/src/prisma/prisma.service.ts ***!
  \**************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);


/***/ },

/***/ "./apps/klypto-crm-nest-js/src/rbac/dto/rbac.dto.ts"
/*!**********************************************************!*\
  !*** ./apps/klypto-crm-nest-js/src/rbac/dto/rbac.dto.ts ***!
  \**********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserRolesResponseDto = exports.UserBasicDto = exports.UserRoleItemDto = exports.AssignRoleResponseDto = exports.RoleAssignmentDto = exports.RoleAssignmentRoleDto = exports.RoleAssignmentUserDto = exports.RoleResponseDto = exports.AssignRoleDto = exports.CreateRoleDto = void 0;
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
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
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], RoleResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-02T10:00:00.000Z' }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
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
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], RoleAssignmentRoleDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-02T10:00:00.000Z' }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
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
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], RoleAssignmentDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-02T10:00:00.000Z' }),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
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
    __metadata("design:type", typeof (_g = typeof Date !== "undefined" && Date) === "function" ? _g : Object)
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


/***/ },

/***/ "./apps/klypto-crm-nest-js/src/rbac/rbac.controller.ts"
/*!*************************************************************!*\
  !*** ./apps/klypto-crm-nest-js/src/rbac/rbac.controller.ts ***!
  \*************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RbacController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const access_token_guard_1 = __webpack_require__(/*! ../auth/guards/access-token.guard */ "./apps/klypto-crm-nest-js/src/auth/guards/access-token.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/roles/roles.guard */ "./apps/klypto-crm-nest-js/src/auth/roles/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/roles/roles.decorator */ "./apps/klypto-crm-nest-js/src/auth/roles/roles.decorator.ts");
const system_role_enum_1 = __webpack_require__(/*! ../auth/roles/system-role.enum */ "./apps/klypto-crm-nest-js/src/auth/roles/system-role.enum.ts");
const rbac_dto_1 = __webpack_require__(/*! ./dto/rbac.dto */ "./apps/klypto-crm-nest-js/src/rbac/dto/rbac.dto.ts");
const rbac_service_1 = __webpack_require__(/*! ./rbac.service */ "./apps/klypto-crm-nest-js/src/rbac/rbac.service.ts");
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
    __metadata("design:paramtypes", [typeof (_b = typeof rbac_dto_1.CreateRoleDto !== "undefined" && rbac_dto_1.CreateRoleDto) === "function" ? _b : Object]),
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
    __metadata("design:paramtypes", [typeof (_c = typeof rbac_dto_1.AssignRoleDto !== "undefined" && rbac_dto_1.AssignRoleDto) === "function" ? _c : Object, Object]),
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
    __metadata("design:paramtypes", [typeof (_a = typeof rbac_service_1.RbacService !== "undefined" && rbac_service_1.RbacService) === "function" ? _a : Object])
], RbacController);


/***/ },

/***/ "./apps/klypto-crm-nest-js/src/rbac/rbac.module.ts"
/*!*********************************************************!*\
  !*** ./apps/klypto-crm-nest-js/src/rbac/rbac.module.ts ***!
  \*********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RbacModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_module_1 = __webpack_require__(/*! ../auth/auth.module */ "./apps/klypto-crm-nest-js/src/auth/auth.module.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/roles/roles.guard */ "./apps/klypto-crm-nest-js/src/auth/roles/roles.guard.ts");
const rbac_controller_1 = __webpack_require__(/*! ./rbac.controller */ "./apps/klypto-crm-nest-js/src/rbac/rbac.controller.ts");
const rbac_service_1 = __webpack_require__(/*! ./rbac.service */ "./apps/klypto-crm-nest-js/src/rbac/rbac.service.ts");
let RbacModule = class RbacModule {
};
exports.RbacModule = RbacModule;
exports.RbacModule = RbacModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        controllers: [rbac_controller_1.RbacController],
        providers: [rbac_service_1.RbacService, roles_guard_1.RolesGuard],
    })
], RbacModule);


/***/ },

/***/ "./apps/klypto-crm-nest-js/src/rbac/rbac.service.ts"
/*!**********************************************************!*\
  !*** ./apps/klypto-crm-nest-js/src/rbac/rbac.service.ts ***!
  \**********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RbacService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./apps/klypto-crm-nest-js/src/prisma/prisma.service.ts");
let RbacService = class RbacService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createRole(dto) {
        const roleName = dto.name.trim().toUpperCase();
        const existingRole = await this.prisma.role.findUnique({
            where: { name: roleName },
        });
        if (existingRole) {
            throw new common_1.ConflictException('Role already exists');
        }
        return this.prisma.role.create({
            data: {
                name: roleName,
                description: dto.description,
                isSystem: false,
            },
        });
    }
    async listRoles() {
        const roles = await this.prisma.role.findMany({
            orderBy: { createdAt: 'asc' },
            include: {
                _count: {
                    select: { assignments: true },
                },
            },
        });
        return roles.map((role) => ({
            id: role.id,
            name: role.name,
            description: role.description,
            isSystem: role.isSystem,
            assignedUsersCount: role._count.assignments,
            createdAt: role.createdAt,
            updatedAt: role.updatedAt,
        }));
    }
    async assignRole(dto, assignedById) {
        const roleName = dto.roleName.trim().toUpperCase();
        const user = await this.prisma.user.findUnique({
            where: { id: dto.userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const role = await this.prisma.role.findUnique({
            where: { name: roleName },
        });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        const assignment = await this.prisma.userRole.upsert({
            where: {
                userId_roleId: {
                    userId: user.id,
                    roleId: role.id,
                },
            },
            update: {
                assignedById,
            },
            create: {
                userId: user.id,
                roleId: role.id,
                assignedById,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
                role: true,
            },
        });
        return {
            message: 'Role assigned successfully',
            assignment,
        };
    }
    async getUserRoles(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                roleAssignments: {
                    include: {
                        role: true,
                        assignedBy: {
                            select: {
                                id: true,
                                email: true,
                                fullName: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
            },
            roles: user.roleAssignments.map((assignment) => ({
                assignmentId: assignment.id,
                roleId: assignment.role.id,
                roleName: assignment.role.name,
                description: assignment.role.description,
                isSystem: assignment.role.isSystem,
                assignedAt: assignment.createdAt,
                assignedBy: assignment.assignedBy,
            })),
        };
    }
};
exports.RbacService = RbacService;
exports.RbacService = RbacService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], RbacService);


/***/ },

/***/ "./apps/klypto-crm-nest-js/src/users/users.module.ts"
/*!***********************************************************!*\
  !*** ./apps/klypto-crm-nest-js/src/users/users.module.ts ***!
  \***********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const users_service_1 = __webpack_require__(/*! ./users.service */ "./apps/klypto-crm-nest-js/src/users/users.service.ts");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService],
    })
], UsersModule);


/***/ },

/***/ "./apps/klypto-crm-nest-js/src/users/users.service.ts"
/*!************************************************************!*\
  !*** ./apps/klypto-crm-nest-js/src/users/users.service.ts ***!
  \************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./apps/klypto-crm-nest-js/src/prisma/prisma.service.ts");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOneByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                organization: true,
                roleAssignments: {
                    include: {
                        role: true,
                    },
                },
            },
        });
    }
    async findOneById(id) {
        return this.prisma.user.findUnique({
            where: { id },
            include: {
                organization: true,
                roleAssignments: {
                    include: {
                        role: true,
                    },
                },
            },
        });
    }
    async create(data) {
        return this.prisma.user.create({
            data,
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], UsersService);


/***/ },

/***/ "@nestjs-modules/mailer"
/*!*****************************************!*\
  !*** external "@nestjs-modules/mailer" ***!
  \*****************************************/
(module) {

module.exports = require("@nestjs-modules/mailer");

/***/ },

/***/ "@nestjs/common"
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
(module) {

module.exports = require("@nestjs/common");

/***/ },

/***/ "@nestjs/config"
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
(module) {

module.exports = require("@nestjs/config");

/***/ },

/***/ "@nestjs/core"
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
(module) {

module.exports = require("@nestjs/core");

/***/ },

/***/ "@nestjs/jwt"
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
(module) {

module.exports = require("@nestjs/jwt");

/***/ },

/***/ "@nestjs/passport"
/*!***********************************!*\
  !*** external "@nestjs/passport" ***!
  \***********************************/
(module) {

module.exports = require("@nestjs/passport");

/***/ },

/***/ "@nestjs/swagger"
/*!**********************************!*\
  !*** external "@nestjs/swagger" ***!
  \**********************************/
(module) {

module.exports = require("@nestjs/swagger");

/***/ },

/***/ "@prisma/client"
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
(module) {

module.exports = require("@prisma/client");

/***/ },

/***/ "bcryptjs"
/*!***************************!*\
  !*** external "bcryptjs" ***!
  \***************************/
(module) {

module.exports = require("bcryptjs");

/***/ },

/***/ "class-validator"
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
(module) {

module.exports = require("class-validator");

/***/ },

/***/ "passport-jwt"
/*!*******************************!*\
  !*** external "passport-jwt" ***!
  \*******************************/
(module) {

module.exports = require("passport-jwt");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************************************!*\
  !*** ./apps/klypto-crm-nest-js/src/main.ts ***!
  \*********************************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./apps/klypto-crm-nest-js/src/app.module.ts");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        optionsSuccessStatus: 200,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Klypto CRM API')
        .setDescription('The Klypto CRM ERP Portal API documentation')
        .setVersion('1.0')
        .addTag('Klypto')
        .addServer(`http://localhost:${process.env.PORT || 3000}`, 'Local Environment')
        .addServer('https://api.yourdomain.com', 'Production Environment')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    const totalApis = Object.values(document.paths).reduce((acc, path) => acc + Object.keys(path).length, 0);
    document.info.description = `**Total API Endpoints: ${totalApis}**\n\n${document.info.description}`;
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            displayOperationId: true,
            filter: true,
        },
        customSiteTitle: 'Klypto CRM API Docs',
    });
    await app.listen(process.env.PORT || 3000);
}
bootstrap();

})();

/******/ })()
;