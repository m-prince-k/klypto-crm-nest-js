import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto, CreateProjectTaskDto, UpdateProjectTaskDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

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
  async findAllProjects(organizationId: string) {
    return this.prisma.project.findMany({
      where: { organizationId },
      include: { _count: { select: { tasks: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createProject(organizationId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: { ...dto, organizationId },
    });
  }

  async updateProject(organizationId: string, id: string, dto: UpdateProjectDto) {
    const project = await this.prisma.project.findFirst({ where: { id, organizationId } });
    if (!project) throw new NotFoundException('Project not found');
    return this.prisma.project.update({ where: { id }, data: dto });
  }

  // Tasks
  async findAllTasks(organizationId: string, projectId?: string) {
    return this.prisma.projectTask.findMany({
      where: { 
        organizationId,
        ...(projectId && { projectId })
      },
      include: { 
        assignee: { select: { id: true, fullName: true } },
        project: { select: { name: true } }
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async createTask(organizationId: string, dto: CreateProjectTaskDto) {
    return this.prisma.projectTask.create({
      data: { ...dto, organizationId },
      include: { assignee: { select: { id: true, fullName: true } } },
    });
  }

  async updateTask(organizationId: string, id: string, dto: UpdateProjectTaskDto) {
    const task = await this.prisma.projectTask.findFirst({ where: { id, organizationId } });
    if (!task) throw new NotFoundException('Task not found');

    return this.prisma.projectTask.update({
      where: { id },
      data: dto,
      include: { assignee: { select: { id: true, fullName: true } } },
    });
  }

  async deleteTask(organizationId: string, id: string) {
    const task = await this.prisma.projectTask.findFirst({ where: { id, organizationId } });
    if (!task) throw new NotFoundException('Task not found');
    return this.prisma.projectTask.delete({ where: { id } });
  }
}
