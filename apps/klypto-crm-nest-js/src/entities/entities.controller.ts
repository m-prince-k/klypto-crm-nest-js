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
import { EntitiesService } from './entities.service';
import {
  CreateBranchDto,
  UpdateBranchDto,
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from './dto/entities.dto';
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
  async createBranch(
    @Req() req: { user?: { sub?: string } },
    @Body() dto: CreateBranchDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.entitiesService.getOrganizationId(req.user.sub);
    return this.entitiesService.createBranch(orgId, dto);
  }

  @Patch('branches/:id')
  @ApiOperation({ summary: 'Update a branch' })
  async updateBranch(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
    @Body() dto: UpdateBranchDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.entitiesService.getOrganizationId(req.user.sub);
    return this.entitiesService.updateBranch(orgId, id, dto);
  }

  @Delete('branches/:id')
  @ApiOperation({ summary: 'Delete a branch' })
  async removeBranch(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.entitiesService.getOrganizationId(req.user.sub);
    return this.entitiesService.deleteBranch(orgId, id);
  }

  @Get('departments')
  @ApiOperation({ summary: 'Get all departments' })
  async findAllDepartments(
    @Req() req: { user?: { sub?: string } },
    @Query('branchId') branchId?: string,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.entitiesService.getOrganizationId(req.user.sub);
    return this.entitiesService.findAllDepartments(orgId, branchId);
  }

  @Post('departments')
  @ApiOperation({ summary: 'Create a new department' })
  async createDepartment(
    @Req() req: { user?: { sub?: string } },
    @Body() dto: CreateDepartmentDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.entitiesService.getOrganizationId(req.user.sub);
    return this.entitiesService.createDepartment(orgId, dto);
  }

  @Patch('departments/:id')
  @ApiOperation({ summary: 'Update a department' })
  async updateDepartment(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
    @Body() dto: UpdateDepartmentDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.entitiesService.getOrganizationId(req.user.sub);
    return this.entitiesService.updateDepartment(orgId, id, dto);
  }

  @Delete('departments/:id')
  @ApiOperation({ summary: 'Delete a department' })
  async removeDepartment(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.entitiesService.getOrganizationId(req.user.sub);
    return this.entitiesService.deleteDepartment(orgId, id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get organizational statistics' })
  async getStats(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.entitiesService.getOrganizationId(req.user.sub);
    return this.entitiesService.getStats(orgId);
  }
}
