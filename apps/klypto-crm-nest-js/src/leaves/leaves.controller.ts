import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { LeavesService } from './leaves.service';
import { CreateLeaveDto, UpdateLeaveStatusDto } from './dto/leave.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

@ApiTags('Leaves')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('leaves')
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get leave request statistics' })
  async getStats(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.leavesService.getOrganizationId(req.user.sub);
    return this.leavesService.getStats(orgId);
  }

  @Get('my-employee-id')
  @ApiOperation({ summary: 'Get the employee ID linked to the current user' })
  async getMyEmployeeId(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const employeeId = await this.leavesService.getEmployeeId(req.user.sub);
    return { employeeId };
  }

  @Get()
  @ApiOperation({ summary: 'Get all leave requests' })
  async findAll(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.leavesService.getOrganizationId(req.user.sub);
    return this.leavesService.findAll(orgId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new leave request' })
  async create(@Req() req: { user?: { sub?: string } }, @Body() dto: CreateLeaveDto) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.leavesService.getOrganizationId(req.user.sub);
    return this.leavesService.create(orgId, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Approve or reject a leave request' })
  async updateStatus(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
    @Body() dto: UpdateLeaveStatusDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.leavesService.getOrganizationId(req.user.sub);
    return this.leavesService.updateStatus(orgId, id, dto);
  }
}
