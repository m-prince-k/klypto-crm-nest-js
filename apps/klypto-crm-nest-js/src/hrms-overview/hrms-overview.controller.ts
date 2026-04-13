import {
  Controller,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { HrmsOverviewService } from './hrms-overview.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

@ApiTags('HR Overview')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('hrms-overview')
export class HrmsOverviewController {
  constructor(private readonly hrmsOverviewService: HrmsOverviewService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get aggregated HR statistics' })
  async getStats(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.hrmsOverviewService.getOrganizationId(
      req.user.sub,
    );
    return this.hrmsOverviewService.getStats(orgId);
  }
}
