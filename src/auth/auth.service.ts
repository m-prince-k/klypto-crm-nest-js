import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, SignupDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { SystemRole } from './roles/system-role.enum';

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

    const usersCount = await this.prisma.user.count();

    const passwordHash = await bcrypt.hash(signupDto.password, 10);

    const organizationName = signupDto.organizationName.trim();

    const existingOrganization = await this.prisma.organization.findFirst({
      where: {
        name: organizationName,
      },
    });

    const organization =
      existingOrganization ??
      (await this.prisma.organization.create({
        data: {
          name: organizationName,
        },
      }));

    const user = await this.usersService.create({
      email: signupDto.email,
      fullName: signupDto.fullName,
      passwordHash,
      organization: {
        connect: { id: organization.id },
      },
    });

    const assignedRoles: string[] = [];

    if (usersCount === 0) {
      await this.ensureSuperAdminRole();
      await this.assignRoleToUser(user.id, SystemRole.SUPER_ADMIN, null);
      assignedRoles.push(SystemRole.SUPER_ADMIN);
    }

    const tokens = await this.getTokens(user.id, user.email, assignedRoles);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      ...(assignedRoles[0] ? { role: assignedRoles[0] } : {}),
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

    const roles = user.roleAssignments.map(
      (assignment) => assignment.role.name,
    );
    const tokens = await this.getTokens(user.id, user.email, roles);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      roles,
    };
  }

  async logout(userId: string) {
    if (!userId) {
      throw new UnauthorizedException('Invalid user context');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    });

    return { message: 'Logged out successfully' };
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

    const roles = user.roleAssignments.map(
      (assignment) => assignment.role.name,
    );
    const tokens = await this.getTokens(user.id, user.email, roles);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      roles,
    };
  }

  async getProfile(userId?: string) {
    if (!userId) {
      throw new UnauthorizedException('Invalid user context');
    }

    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      organization: user.organization,
      roles: user.roleAssignments.map((assignment) => assignment.role.name),
      isActive: user.isActive,
      createdAt: user.createdAt,
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

  async getTokens(userId: string, email: string, roles: string[]) {
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

  private async ensureSuperAdminRole() {
    await this.prisma.role.upsert({
      where: { name: SystemRole.SUPER_ADMIN },
      update: {
        description: 'Platform-level super administrator',
        isSystem: true,
      },
      create: {
        name: SystemRole.SUPER_ADMIN,
        description: 'Platform-level super administrator',
        isSystem: true,
      },
    });
  }

  private async assignRoleToUser(
    userId: string,
    roleName: string,
    assignedById: string | null,
  ) {
    const role = await this.prisma.role.findUnique({
      where: { name: roleName },
    });
    if (!role) {
      throw new UnauthorizedException('Role does not exist');
    }

    await this.prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId,
          roleId: role.id,
        },
      },
      update: {
        assignedById,
      },
      create: {
        userId,
        roleId: role.id,
        assignedById,
      },
    });
  }
}
