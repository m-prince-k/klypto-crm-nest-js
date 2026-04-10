import { Controller, Get, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ErpOverviewService } from './erp-overview.service';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@ApiTags('ERP Overview')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard)
@Controller('erp-overview')
export class ErpOverviewController {
  constructor(private readonly erpOverviewService: ErpOverviewService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get aggregated ERP analytics' })
  async getStats(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.erpOverviewService.getOrganizationId(req.user.sub);
    return this.erpOverviewService.getStats(orgId);
  }
}
