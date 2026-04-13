import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { PerformanceService } from './performance.service';
import { CreatePerformanceReviewDto, UpdatePerformanceReviewDto } from './dto/performance.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

@ApiTags('Performance')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Get()
  @ApiOperation({ summary: 'Get all performance reviews' })
  async findAll(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.performanceService.getOrganizationId(req.user.sub);
    return this.performanceService.findAll(orgId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new performance review' })
  async create(@Req() req: { user?: { sub?: string } }, @Body() dto: CreatePerformanceReviewDto) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.performanceService.getOrganizationId(req.user.sub);
    return this.performanceService.create(orgId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a performance review' })
  async update(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
    @Body() dto: UpdatePerformanceReviewDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.performanceService.getOrganizationId(req.user.sub);
    return this.performanceService.update(orgId, id, dto);
  }
}
