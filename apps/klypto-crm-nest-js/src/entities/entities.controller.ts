import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, Query, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { EntitiesService } from './entities.service';
import { CreateBranchDto, UpdateBranchDto, CreateDepartmentDto, UpdateDepartmentDto } from './dto/entities.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

@ApiTags('Entities')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('entities')
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  @Get('branches')
  @ApiOperation({ summary: 'Get all branches' })
  async findAllBranches(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.entitiesService.getOrganizationId(req.user.sub);
    return this.entitiesService.findAllBranches(orgId);
  }

  @Post('branches')
  @ApiOperation({ summary: 'Create a new branch' })
  async createBranch(@Req() req: { user?: { sub?: string } }, @Body() dto: CreateBranchDto) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.entitiesService.getOrganizationId(req.user.sub);
    return this.entitiesService.createBranch(orgId, dto);
  }

  @Get('departments')
  @ApiOperation({ summary: 'Get all departments' })
  async findAllDepartments(@Req() req: { user?: { sub?: string } }, @Query('branchId') branchId?: string) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.entitiesService.getOrganizationId(req.user.sub);
    return this.entitiesService.findAllDepartments(orgId, branchId);
  }

  @Post('departments')
  @ApiOperation({ summary: 'Create a new department' })
  async createDepartment(@Req() req: { user?: { sub?: string } }, @Body() dto: CreateDepartmentDto) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.entitiesService.getOrganizationId(req.user.sub);
    return this.entitiesService.createDepartment(orgId, dto);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get organizational statistics' })
  async getStats(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.entitiesService.getOrganizationId(req.user.sub);
    return this.entitiesService.getStats(orgId);
  }
}
