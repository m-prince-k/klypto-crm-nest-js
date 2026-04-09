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
exports.RbacService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RbacService);
//# sourceMappingURL=rbac.service.js.map