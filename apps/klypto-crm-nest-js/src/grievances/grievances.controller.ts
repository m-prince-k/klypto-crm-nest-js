import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { GrievancesService } from './grievances.service';
import { CreateGrievanceDto, UpdateGrievanceDto } from './dto/grievance.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

@ApiTags('Grievances')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('grievances')
export class GrievancesController {
  constructor(private readonly grievancesService: GrievancesService) {}

  private getNormalizedRoles(roles: string[] = []) {
    return roles.map((role) => String(role).toUpperCase());
  }

  private hasPrivilegedGrievanceAccess(roles: string[]) {
    return ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'HR'].some((role) =>
      roles.includes(role),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all grievances' })
  async findAll(@Req() req: { user?: { sub?: string; roles?: string[] } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.grievancesService.getOrganizationId(req.user.sub);
    const roles = this.getNormalizedRoles(req.user.roles || []);
    const isEmployeeOnly =
      roles.includes('EMPLOYEE') && !this.hasPrivilegedGrievanceAccess(roles);

    if (isEmployeeOnly) {
      const employeeId = await this.grievancesService.getEmployeeId(
        req.user.sub,
      );
      if (!employeeId) return [];
      return this.grievancesService.findAll(orgId, employeeId);
    }

    return this.grievancesService.findAll(orgId);
  }

  @Post()
  @ApiOperation({ summary: 'Submit a new grievance' })
  async create(
    @Req() req: { user?: { sub?: string } },
    @Body() dto: CreateGrievanceDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.grievancesService.getOrganizationId(req.user.sub);
    return this.grievancesService.create(orgId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a grievance' })
  async update(
    @Req() req: { user?: { sub?: string; roles?: string[] } },
    @Param('id') id: string,
    @Body() dto: UpdateGrievanceDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');

    const roles = this.getNormalizedRoles(req.user.roles || []);
    if (!this.hasPrivilegedGrievanceAccess(roles)) {
      throw new ForbiddenException(
        'You do not have permission to update grievance status',
      );
    }

    const orgId = await this.grievancesService.getOrganizationId(req.user.sub);
    return this.grievancesService.update(orgId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a grievance' })
  async remove(
    @Req() req: { user?: { sub?: string; roles?: string[] } },
    @Param('id') id: string,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');

    const roles = this.getNormalizedRoles(req.user.roles || []);
    if (!this.hasPrivilegedGrievanceAccess(roles)) {
      throw new ForbiddenException(
        'You do not have permission to delete grievance records',
      );
    }

    const orgId = await this.grievancesService.getOrganizationId(req.user.sub);
    return this.grievancesService.delete(orgId, id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get grievance dashboard statistics' })
  async getStats(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.grievancesService.getOrganizationId(req.user.sub);
    return this.grievancesService.getStats(orgId);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent grievances' })
  async findRecent(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.grievancesService.getOrganizationId(req.user.sub);
    return this.grievancesService.findRecent(orgId);
  }
}
