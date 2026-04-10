import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, SignupDto, CreateUserDto } from './dto/auth.dto';
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
  'users',
];

// Modules available per role (mirrors frontend access.js)
const ROLE_MODULES: Record<string, string[]> = {
  SUPER_ADMIN: DEFAULT_DASHBOARD_MODULES,
  ADMIN: [
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
    'users',
  ],
  MANAGER: [
    'dashboard',
    'leads',
    'recruitment',
    'grievances',
    'leave',
    'settings',
  ],
  HR: ['dashboard', 'hrms', 'employees', 'leave', 'settings'],
  EMPLOYEE: ['dashboard', 'employees', 'leave', 'grievances', 'settings'],
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  /** One-time org bootstrap — only called from the /signup page */
  async signup(signupDto: SignupDto) {
    const existingUser = await this.usersService.findOneByEmail(
      signupDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await bcrypt.hash(signupDto.password, 10);

    const organization = await this.prisma.organization.create({
      data: { name: signupDto.organizationName },
    });

    const user = await this.usersService.create({
      email: signupDto.email,
      fullName: signupDto.fullName,
      passwordHash,
      organization: { connect: { id: organization.id } },
    });

    // First user is always SUPER_ADMIN
    await this.ensureRole(SystemRole.SUPER_ADMIN, DEFAULT_DASHBOARD_MODULES);
    await this.assignRole(user.id, SystemRole.SUPER_ADMIN);

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

  /** SuperAdmin / Admin creates a new employee account */
  async createUser(adminUserId: string, dto: CreateUserDto) {
    // 1. Verify the caller exists and has admin rights
    const adminUser = await this.usersService.findOneById(adminUserId);
    if (!adminUser) throw new UnauthorizedException('Invalid user context');

    const adminRoles = adminUser.roleAssignments.map((r) =>
      r.role.name.toUpperCase(),
    );
    const canCreate =
      adminRoles.includes(SystemRole.SUPER_ADMIN) ||
      adminRoles.includes(SystemRole.ADMIN);
    if (!canCreate)
      throw new ForbiddenException('Only admins can create user accounts');

    // 2. Ensure email is unique
    const existing = await this.usersService.findOneByEmail(dto.email);
    if (existing)
      throw new ConflictException('A user with this email already exists');

    // 3. Hash password and create User record
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const newUser = await this.usersService.create({
      email: dto.email,
      fullName: dto.fullName,
      passwordHash,
      organization: { connect: { id: adminUser.organizationId } },
    });

    // 4. Ensure the system role exists with correct modules and assign it
    const roleKey = dto.role.toUpperCase();
    const roleModules = ROLE_MODULES[roleKey] ?? ROLE_MODULES.EMPLOYEE;
    await this.ensureRole(roleKey, roleModules);
    await this.assignRole(newUser.id, roleKey);

    // 5. Auto-create a linked Employee record
    const code =
      dto.employeeCode || `EMP-${Date.now().toString(36).toUpperCase()}`;

    const employee = await this.prisma.employee.create({
      data: {
        name: dto.fullName,
        code,
        role: dto.jobTitle || dto.role,
        department: dto.department || 'General',
        status: 'Active',
        organization: { connect: { id: adminUser.organizationId } },
        user: { connect: { id: newUser.id } },
      },
    });

    return {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      role: roleKey,
      isActive: newUser.isActive,
      employeeCode: employee.code,
    };
  }

  /** Returns whether at least one organization exists (first-time setup guard) */
  async checkOrgExists(): Promise<{ exists: boolean }> {
    const count = await this.prisma.organization.count();
    return { exists: count > 0 };
  }

  /** Lists all users in the same org as the requester */
  async listOrgUsers(adminUserId: string) {
    const adminUser = await this.usersService.findOneById(adminUserId);
    if (!adminUser) throw new UnauthorizedException('Invalid user context');

    const users = await this.prisma.user.findMany({
      where: { organizationId: adminUser.organizationId },
      include: {
        roleAssignments: { include: { role: true } },
        employee: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map((u) => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      isActive: u.isActive,
      roles: u.roleAssignments.map((ra) => ra.role.name),
      employeeCode: u.employee?.code ?? null,
      department: u.employee?.department ?? null,
      jobTitle: u.employee?.role ?? null,
      createdAt: u.createdAt,
    }));
  }

  /** Toggle a user's active/inactive status */
  async toggleUserStatus(adminUserId: string, targetUserId: string) {
    const adminUser = await this.usersService.findOneById(adminUserId);
    if (!adminUser) throw new UnauthorizedException();

    const adminRoles = adminUser.roleAssignments.map((r) =>
      r.role.name.toUpperCase(),
    );
    if (
      !adminRoles.includes(SystemRole.SUPER_ADMIN) &&
      !adminRoles.includes(SystemRole.ADMIN)
    ) {
      throw new ForbiddenException('Only admins can modify user status');
    }

    const target = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });
    if (!target) throw new UnauthorizedException('Target user not found');

    const updated = await this.prisma.user.update({
      where: { id: targetUserId },
      data: { isActive: !target.isActive },
    });

    return { id: updated.id, isActive: updated.isActive };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Your account has been deactivated. Contact your administrator.',
      );
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

    return { accessToken, refreshToken };
  }

  private async ensureRole(roleName: string, modules?: string[]) {
    const dashboardModules =
      modules ?? ROLE_MODULES[roleName.toUpperCase()] ?? [];
    await this.prisma.role.upsert({
      where: { name: roleName },
      update: { dashboardModules },
      create: {
        name: roleName,
        description: `${roleName} system role`,
        isSystem: true,
        dashboardModules,
      },
    });
  }

  private async assignRole(userId: string, roleName: string) {
    const role = await this.prisma.role.findUnique({
      where: { name: roleName },
    });
    if (!role) return;

    await this.prisma.userRole.upsert({
      where: { userId_roleId: { userId, roleId: role.id } },
      update: {},
      create: { userId, roleId: role.id },
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
    const hasAdmin = roleSet.has(SystemRole.ADMIN);
    const effectiveModules = hasSuperAdmin
      ? DEFAULT_DASHBOARD_MODULES
      : dashboardModules;

    return {
      isSuperAdmin: hasSuperAdmin,
      canManageUsers: hasSuperAdmin || hasAdmin,
      canManageRbac: hasSuperAdmin,
      canViewDashboard: hasSuperAdmin || effectiveModules.length > 0,
      dashboardModules: effectiveModules,
    };
  }

  private async ensureUserHasDefaultRole(
    userId: string,
    existingRoleCount: number,
  ) {
    if (existingRoleCount > 0) return;
    await this.ensureRole(SystemRole.EMPLOYEE, ROLE_MODULES.EMPLOYEE);
    await this.assignRole(userId, SystemRole.EMPLOYEE);
  }
}
