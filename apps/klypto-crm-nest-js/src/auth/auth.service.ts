import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, SignupDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { SystemRole } from './roles/system-role.enum';

const DEFAULT_DASHBOARD_MODULES = [
  'dashboard',
  'leads',
  'erp',
  'recruitment',
  'grievances',
  'payroll',
  'hrms',
  'leave',
  'employees',
  'settings',
  'roles-access',
];

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async signup(signupDto: SignupDto) {
    const existingUser = await this.usersService.findOneByEmail(
      signupDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User already exists');
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

    const roleToAssign =
      (await this.prisma.user.count()) === 1
        ? SystemRole.SUPER_ADMIN
        : SystemRole.EMPLOYEE;

    await this.ensureRole(roleToAssign);
    await this.assignRole(user.id, roleToAssign);

    const { roles, dashboardModules } = await this.getUserRoleAccess(user.id);
    const tokens = await this.getTokens(user.id, user.email, roles);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      roles,
      dashboardModules,
      access: this.buildAccessFromRoles(roles, dashboardModules),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.ensureUserHasDefaultRole(user.id, user.roleAssignments.length);
    const { roles, dashboardModules } = await this.getUserRoleAccess(user.id);
    const tokens = await this.getTokens(user.id, user.email, roles);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      roles,
      dashboardModules,
      access: this.buildAccessFromRoles(roles, dashboardModules),
    };
  }

  async getProfile(userId: string) {
    if (!userId) {
      throw new UnauthorizedException('Invalid user context');
    }

    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.ensureUserHasDefaultRole(user.id, user.roleAssignments.length);
    const { roles, dashboardModules } = await this.getUserRoleAccess(user.id);

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      organization: user.organization,
      roles,
      dashboardModules,
      access: this.buildAccessFromRoles(roles, dashboardModules),
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findOneById(userId);
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    await this.ensureUserHasDefaultRole(user.id, user.roleAssignments.length);
    const { roles, dashboardModules } = await this.getUserRoleAccess(user.id);
    const tokens = await this.getTokens(user.id, user.email, roles);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      roles,
      dashboardModules,
      access: this.buildAccessFromRoles(roles, dashboardModules),
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    const hashedRefreshToken = refreshToken
      ? await bcrypt.hash(refreshToken, 10)
      : null;
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });
  }

  async getTokens(userId: string, email: string, roles: string[] = []) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, roles },
        {
          secret: process.env.JWT_ACCESS_SECRET || 'access-secret',
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, roles },
        {
          secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async ensureRole(roleName: string) {
    await this.prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: {
        name: roleName,
        description: `${roleName} system role`,
        isSystem: true,
        dashboardModules:
          roleName === SystemRole.SUPER_ADMIN ? DEFAULT_DASHBOARD_MODULES : [],
      },
    });
  }

  private async assignRole(userId: string, roleName: string) {
    const role = await this.prisma.role.findUnique({
      where: { name: roleName },
    });
    if (!role) return;

    await this.prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId,
          roleId: role.id,
        },
      },
      update: {},
      create: {
        userId,
        roleId: role.id,
      },
    });
  }

  private async getUserRoleAccess(userId: string) {
    const assignments = await this.prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });

    const roles = assignments.map((entry) => entry.role.name);
    const dashboardModules = [
      ...new Set(
        assignments.flatMap((entry) => entry.role.dashboardModules || []),
      ),
    ];

    return { roles, dashboardModules };
  }

  private buildAccessFromRoles(roles: string[], dashboardModules: string[]) {
    const roleSet = new Set(roles.map((role) => role.toUpperCase()));
    const hasSuperAdmin = roleSet.has(SystemRole.SUPER_ADMIN);
    const effectiveModules = hasSuperAdmin
      ? DEFAULT_DASHBOARD_MODULES
      : dashboardModules;

    return {
      isSuperAdmin: hasSuperAdmin,
      canManageUsers: hasSuperAdmin || roleSet.has(SystemRole.ADMIN),
      canManageRbac: hasSuperAdmin,
      canViewDashboard: hasSuperAdmin || effectiveModules.length > 0,
      dashboardModules: effectiveModules,
    };
  }

  private async ensureUserHasDefaultRole(
    userId: string,
    existingRoleCount: number,
  ) {
    if (existingRoleCount > 0) {
      return;
    }

    await this.ensureRole(SystemRole.EMPLOYEE);
    await this.assignRole(userId, SystemRole.EMPLOYEE);
  }
}
