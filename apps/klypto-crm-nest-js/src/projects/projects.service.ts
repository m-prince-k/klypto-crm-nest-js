import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProjectDto,
  UpdateProjectDto,
  CreateProjectTaskDto,
  UpdateProjectTaskDto,
} from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  private async resolveManagerId(
    organizationId: string,
    managerId?: string,
  ): Promise<string | null> {
    if (!managerId) return null;

    const manager = await this.prisma.user.findFirst({
      where: { id: managerId, organizationId },
      select: { id: true },
    });

    if (!manager) {
      throw new NotFoundException(
        'Selected project manager not found in organization',
      );
    }

    return manager.id;
  }

  async getOrganizationId(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { organizationId: true },
    });
    if (!user || !user.organizationId) {
      throw new UnauthorizedException('Invalid user context');
    }
    return user.organizationId;
  }

  // Projects
  async findAllProjects(organizationId: string, assigneeId?: string) {
    return this.prisma.project.findMany({
      where: {
        organizationId,
        ...(assigneeId
          ? {
              tasks: {
                some: { assigneeId },
              },
            }
          : {}),
      },
      include: {
        manager: { select: { id: true, fullName: true } },
        createdBy: { select: { id: true, fullName: true } },
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createProject(
    organizationId: string,
    creatorUserId: string,
    dto: CreateProjectDto,
  ) {
    const managerId = await this.resolveManagerId(
      organizationId,
      dto.managerId,
    );

    return this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        status: dto.status,
        organizationId,
        createdById: creatorUserId,
        managerId,
      },
      include: {
        manager: { select: { id: true, fullName: true } },
        createdBy: { select: { id: true, fullName: true } },
        _count: { select: { tasks: true } },
      },
    });
  }

  async updateProject(
    organizationId: string,
    id: string,
    dto: UpdateProjectDto,
  ) {
    const project = await this.prisma.project.findFirst({
      where: { id, organizationId },
    });
    if (!project) throw new NotFoundException('Project not found');
    const managerId = await this.resolveManagerId(
      organizationId,
      dto.managerId,
    );

    return this.prisma.project.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description }
          : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.managerId !== undefined ? { managerId } : {}),
      },
      include: {
        manager: { select: { id: true, fullName: true } },
        createdBy: { select: { id: true, fullName: true } },
        _count: { select: { tasks: true } },
      },
    });
  }

  // Tasks
  async findAllTasks(
    organizationId: string,
    projectId?: string,
    assigneeId?: string,
  ) {
    return this.prisma.projectTask.findMany({
      where: {
        organizationId,
        ...(projectId && { projectId }),
        ...(assigneeId && { assigneeId }),
      },
      include: {
        assignee: { select: { id: true, fullName: true } },
        project: { select: { name: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findTaskById(organizationId: string, id: string) {
    return this.prisma.projectTask.findFirst({
      where: { id, organizationId },
    });
  }

  async createTask(organizationId: string, dto: CreateProjectTaskDto) {
    return this.prisma.projectTask.create({
      data: { ...dto, organizationId },
      include: { assignee: { select: { id: true, fullName: true } } },
    });
  }

  async updateTask(
    organizationId: string,
    id: string,
    dto: UpdateProjectTaskDto,
  ) {
    const task = await this.prisma.projectTask.findFirst({
      where: { id, organizationId },
    });
    if (!task) throw new NotFoundException('Task not found');

    return this.prisma.projectTask.update({
      where: { id },
      data: dto,
      include: { assignee: { select: { id: true, fullName: true } } },
    });
  }

  async deleteTask(organizationId: string, id: string) {
    const task = await this.prisma.projectTask.findFirst({
      where: { id, organizationId },
    });
    if (!task) throw new NotFoundException('Task not found');
    return this.prisma.projectTask.delete({ where: { id } });
  }
}
