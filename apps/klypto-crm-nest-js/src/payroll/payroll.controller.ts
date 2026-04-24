import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { PayrollService } from './payroll.service';
import { CreateSalaryStructureDto, ProcessPayrollDto } from './dto/payroll.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

@ApiTags('Payroll')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get payroll statistics for the current month' })
  async getStats(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.payrollService.getOrganizationId(req.user.sub);
    return this.payrollService.getStats(orgId);
  }

  @Get('structures')
  @ApiOperation({ summary: 'Get all salary structures' })
  async findStructures(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.payrollService.getOrganizationId(req.user.sub);
    return this.payrollService.findStructures(orgId);
  }

  @Post('structures')
  @ApiOperation({
    summary: 'Create or update a salary structure for an employee',
  })
  async upsertStructure(
    @Req() req: { user?: { sub?: string } },
    @Body() dto: CreateSalaryStructureDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.payrollService.getOrganizationId(req.user.sub);
    return this.payrollService.upsertStructure(orgId, dto);
  }

  @Get('records')
  @ApiOperation({ summary: 'Get all payroll records' })
  async findAllRecords(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.payrollService.getOrganizationId(req.user.sub);
    return this.payrollService.findAllRecords(orgId);
  }

  @Post('process')
  @ApiOperation({ summary: 'Process payroll for a given month and year' })
  async processPayroll(
    @Req() req: { user?: { sub?: string } },
    @Body() dto: ProcessPayrollDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.payrollService.getOrganizationId(req.user.sub);
    return this.payrollService.processPayroll(orgId, dto);
  }
}
