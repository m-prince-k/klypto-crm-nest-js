import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, Query, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import { CreateFinanceDto, UpdateFinanceDto } from './dto/finance.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

@ApiTags('Finance')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get()
  @ApiOperation({ summary: 'Get all financial transactions' })
  async findAll(@Req() req: { user?: { sub?: string } }, @Query('type') type?: string) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.financeService.getOrganizationId(req.user.sub);
    return this.financeService.findAll(orgId, type);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  async create(@Req() req: { user?: { sub?: string } }, @Body() dto: CreateFinanceDto) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.financeService.getOrganizationId(req.user.sub);
    return this.financeService.create(orgId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update transaction status' })
  async update(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
    @Body() dto: UpdateFinanceDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.financeService.getOrganizationId(req.user.sub);
    return this.financeService.update(orgId, id, dto);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get financial statistics' })
  async getStats(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.financeService.getOrganizationId(req.user.sub);
    return this.financeService.getStats(orgId);
  }
}
