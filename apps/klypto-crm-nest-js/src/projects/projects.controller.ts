import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, CreateProjectTaskDto, UpdateProjectTaskDto } from './dto/project.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

@ApiTags('Projects')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  async findAllProjects(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.projectsService.getOrganizationId(req.user.sub);
    return this.projectsService.findAllProjects(orgId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  async createProject(@Req() req: { user?: { sub?: string } }, @Body() dto: CreateProjectDto) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.projectsService.getOrganizationId(req.user.sub);
    return this.projectsService.createProject(orgId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  async updateProject(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.projectsService.getOrganizationId(req.user.sub);
    return this.projectsService.updateProject(orgId, id, dto);
  }

  @Get('tasks')
  @ApiOperation({ summary: 'Get all tasks' })
  async findAllTasks(@Req() req: { user?: { sub?: string } }, @Query('projectId') projectId?: string) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.projectsService.getOrganizationId(req.user.sub);
    return this.projectsService.findAllTasks(orgId, projectId);
  }

  @Post('tasks')
  @ApiOperation({ summary: 'Create a new task' })
  async createTask(@Req() req: { user?: { sub?: string } }, @Body() dto: CreateProjectTaskDto) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.projectsService.getOrganizationId(req.user.sub);
    return this.projectsService.createTask(orgId, dto);
  }

  @Patch('tasks/:id')
  @ApiOperation({ summary: 'Update a task' })
  async updateTask(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
    @Body() dto: UpdateProjectTaskDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.projectsService.getOrganizationId(req.user.sub);
    return this.projectsService.updateTask(orgId, id, dto);
  }

  @Delete('tasks/:id')
  @ApiOperation({ summary: 'Delete a task' })
  async removeTask(@Req() req: { user?: { sub?: string } }, @Param('id') id: string) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.projectsService.getOrganizationId(req.user.sub);
    return this.projectsService.deleteTask(orgId, id);
  }
}
