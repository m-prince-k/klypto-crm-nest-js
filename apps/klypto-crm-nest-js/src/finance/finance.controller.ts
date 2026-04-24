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
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import { CreateFinanceDto, UpdateFinanceDto } from './dto/finance.dto';
import { CreateReimbursementDto, UpdateReimbursementStatusDto } from './dto/reimbursement.dto';
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
  async findAll(
    @Req() req: { user?: { sub?: string } },
    @Query('type') type?: string,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.financeService.getOrganizationId(req.user.sub);
    return this.financeService.findAll(orgId, type);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  async create(
    @Req() req: { user?: { sub?: string } },
    @Body() dto: CreateFinanceDto,
  ) {
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction' })
  async remove(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.financeService.getOrganizationId(req.user.sub);
    return this.financeService.delete(orgId, id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get financial statistics' })
  async getStats(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.financeService.getOrganizationId(req.user.sub);
    return this.financeService.getStats(orgId);
  }

  // --- REIMBURSEMENT ENDPOINTS ---

  @Post('reimbursements')
  @ApiOperation({ summary: 'Create a reimbursement request' })
  async createReimbursement(
    @Req() req: { user?: { sub?: string } },
    @Body() dto: CreateReimbursementDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.financeService.getOrganizationId(req.user.sub);
    return this.financeService.createReimbursement(orgId, dto);
  }

  @Get('reimbursements')
  @ApiOperation({ summary: 'List all reimbursement requests' })
  async findAllReimbursements(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.financeService.getOrganizationId(req.user.sub);
    return this.financeService.findAllReimbursements(orgId);
  }

  @Patch('reimbursements/:id/status')
  @ApiOperation({ summary: 'Update reimbursement status' })
  async updateReimbursementStatus(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
    @Body() dto: UpdateReimbursementStatusDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.financeService.getOrganizationId(req.user.sub);
    return this.financeService.updateReimbursementStatus(orgId, id, dto);
  }

  @Get('reimbursements/stats')
  @ApiOperation({ summary: 'Get reimbursement statistics' })
  async getReimbursementStats(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.financeService.getOrganizationId(req.user.sub);
    return this.financeService.getReimbursementStats(orgId);
  }
}
