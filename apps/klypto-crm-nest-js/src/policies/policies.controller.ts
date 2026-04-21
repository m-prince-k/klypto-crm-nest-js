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
import { PoliciesService } from './policies.service';
import { CreatePolicyDto, UpdatePolicyDto } from './dto/policy.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

@ApiTags('Policies')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  private getNormalizedRoles(roles: string[] = []) {
    return roles.map((role) => String(role).toUpperCase());
  }

  private canManagePolicies(roles: string[]) {
    return ['SUPER_ADMIN', 'HR'].some((role) => roles.includes(role));
  }

  @Get()
  @ApiOperation({ summary: 'Get all organization policies' })
  async findAll(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.policiesService.getOrganizationId(req.user.sub);
    return this.policiesService.findAll(orgId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get policy details' })
  async findOne(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.policiesService.getOrganizationId(req.user.sub);
    return this.policiesService.findOne(orgId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new policy' })
  async create(
    @Req() req: { user?: { sub?: string; roles?: string[] } },
    @Body() dto: CreatePolicyDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');

    const roles = this.getNormalizedRoles(req.user.roles || []);
    if (!this.canManagePolicies(roles)) {
      throw new ForbiddenException(
        'You do not have permission to create policies',
      );
    }

    const orgId = await this.policiesService.getOrganizationId(req.user.sub);
    return this.policiesService.create(orgId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing policy' })
  async update(
    @Req() req: { user?: { sub?: string; roles?: string[] } },
    @Param('id') id: string,
    @Body() dto: UpdatePolicyDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');

    const roles = this.getNormalizedRoles(req.user.roles || []);
    if (!this.canManagePolicies(roles)) {
      throw new ForbiddenException(
        'You do not have permission to update policies',
      );
    }

    const orgId = await this.policiesService.getOrganizationId(req.user.sub);
    return this.policiesService.update(orgId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a policy' })
  async remove(
    @Req() req: { user?: { sub?: string; roles?: string[] } },
    @Param('id') id: string,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');

    const roles = this.getNormalizedRoles(req.user.roles || []);
    if (!this.canManagePolicies(roles)) {
      throw new ForbiddenException(
        'You do not have permission to delete policies',
      );
    }

    const orgId = await this.policiesService.getOrganizationId(req.user.sub);
    return this.policiesService.remove(orgId, id);
  }
}
