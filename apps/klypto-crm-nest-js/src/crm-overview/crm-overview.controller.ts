import { Controller, Get, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { CrmOverviewService } from './crm-overview.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

@ApiTags('CRM Overview')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('crm-overview')
export class CrmOverviewController {
  constructor(private readonly crmOverviewService: CrmOverviewService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get aggregated CRM statistics' })
  async getStats(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.crmOverviewService.getOrganizationId(req.user.sub);
    return this.crmOverviewService.getStats(orgId);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent leads' })
  async getRecentLeads(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.crmOverviewService.getOrganizationId(req.user.sub);
    return this.crmOverviewService.getRecentLeads(orgId);
  }
}
