"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
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
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map