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
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import {
  CreateProjectDto,
  UpdateProjectDto,
  CreateProjectTaskDto,
  UpdateProjectTaskDto,
} from './dto/project.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

@ApiTags('Projects')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  private normalizeRoles(roles: string[] = []) {
    return roles.map((role) => String(role).toUpperCase());
  }

  private hasProjectManageAccess(roles: string[]) {
    return ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'HR'].some((role) =>
      roles.includes(role),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  async findAllProjects(
    @Req() req: { user?: { sub?: string; roles?: string[] } },
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.projectsService.getOrganizationId(req.user.sub);
    const roles = this.normalizeRoles(req.user.roles || []);
    const canManage = this.hasProjectManageAccess(roles);
    return this.projectsService.findAllProjects(
      orgId,
      canManage ? undefined : req.user.sub,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  async createProject(
    @Req() req: { user?: { sub?: string; roles?: string[] } },
    @Body() dto: CreateProjectDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const roles = this.normalizeRoles(req.user.roles || []);
    if (!this.hasProjectManageAccess(roles)) {
      throw new ForbiddenException(
        'Only project managers, HR, or admins can create projects',
      );
    }
    const orgId = await this.projectsService.getOrganizationId(req.user.sub);
    return this.projectsService.createProject(orgId, req.user.sub, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  async updateProject(
    @Req() req: { user?: { sub?: string; roles?: string[] } },
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const roles = this.normalizeRoles(req.user.roles || []);
    if (!this.hasProjectManageAccess(roles)) {
      throw new ForbiddenException(
        'Only project managers, HR, or admins can update projects',
      );
    }
    const orgId = await this.projectsService.getOrganizationId(req.user.sub);
    return this.projectsService.updateProject(orgId, id, dto);
  }

  @Get('tasks')
  @ApiOperation({ summary: 'Get all tasks' })
  async findAllTasks(
    @Req() req: { user?: { sub?: string; roles?: string[] } },
    @Query('projectId') projectId?: string,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.projectsService.getOrganizationId(req.user.sub);
    const roles = this.normalizeRoles(req.user.roles || []);
    const canManage = this.hasProjectManageAccess(roles);
    return this.projectsService.findAllTasks(
      orgId,
      projectId,
      canManage ? undefined : req.user.sub,
    );
  }

  @Post('tasks')
  @ApiOperation({ summary: 'Create a new task' })
  async createTask(
    @Req() req: { user?: { sub?: string; roles?: string[] } },
    @Body() dto: CreateProjectTaskDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const roles = this.normalizeRoles(req.user.roles || []);
    const orgId = await this.projectsService.getOrganizationId(req.user.sub);

    if (!this.hasProjectManageAccess(roles)) {
      const myProjects = await this.projectsService.findAllProjects(
        orgId,
        req.user.sub,
      );
      const canCreateInProject = myProjects.some(
        (project) => String(project.id) === String(dto.projectId),
      );

      if (!canCreateInProject) {
        throw new ForbiddenException(
          'You can only create tasks in projects assigned to you',
        );
      }

      if (dto.assigneeId && dto.assigneeId !== req.user.sub) {
        throw new ForbiddenException(
          'You can only create tasks assigned to yourself',
        );
      }

      return this.projectsService.createTask(orgId, {
        ...dto,
        assigneeId: req.user.sub,
      });
    }

    return this.projectsService.createTask(orgId, dto);
  }

  @Patch('tasks/:id')
  @ApiOperation({ summary: 'Update a task' })
  async updateTask(
    @Req() req: { user?: { sub?: string; roles?: string[] } },
    @Param('id') id: string,
    @Body() dto: UpdateProjectTaskDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.projectsService.getOrganizationId(req.user.sub);
    const roles = this.normalizeRoles(req.user.roles || []);
    const canManage = this.hasProjectManageAccess(roles);

    if (!canManage) {
      const existingTask = await this.projectsService.findTaskById(orgId, id);
      if (!existingTask) throw new NotFoundException('Task not found');
      if (existingTask.assigneeId !== req.user.sub) {
        throw new ForbiddenException('You can only update your assigned tasks');
      }

      const allowedStatuses = ['inprogress', 'review', 'done'];
      const requestedKeys = Object.keys(dto || {});
      const onlyStatusChange =
        requestedKeys.length === 1 && requestedKeys[0] === 'status';
      if (!onlyStatusChange || !allowedStatuses.includes(String(dto.status))) {
        throw new ForbiddenException(
          'You can only move your task status to in progress, review, or done',
        );
      }
    }

    return this.projectsService.updateTask(orgId, id, dto);
  }

  @Delete('tasks/:id')
  @ApiOperation({ summary: 'Delete a task' })
  async removeTask(
    @Req() req: { user?: { sub?: string; roles?: string[] } },
    @Param('id') id: string,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const roles = this.normalizeRoles(req.user.roles || []);
    if (!this.hasProjectManageAccess(roles)) {
      throw new ForbiddenException(
        'Only project managers, HR, or admins can delete tasks',
      );
    }
    const orgId = await this.projectsService.getOrganizationId(req.user.sub);
    return this.projectsService.deleteTask(orgId, id);
  }
}
