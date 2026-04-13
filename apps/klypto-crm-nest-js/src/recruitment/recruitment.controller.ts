import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { RecruitmentService } from './recruitment.service';
import { CreateJobPostingDto, UpdateJobPostingDto, CreateCandidateDto, UpdateCandidateDto } from './dto/recruitment.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

@ApiTags('Recruitment')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('recruitment')
export class RecruitmentController {
  constructor(private readonly recruitmentService: RecruitmentService) {}

  @Get('jobs')
  @ApiOperation({ summary: 'Get all job postings' })
  async findAllJobs(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.recruitmentService.getOrganizationId(req.user.sub);
    return this.recruitmentService.findAllJobs(orgId);
  }

  @Post('jobs')
  @ApiOperation({ summary: 'Create a new job posting' })
  async createJob(@Req() req: { user?: { sub?: string } }, @Body() dto: CreateJobPostingDto) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.recruitmentService.getOrganizationId(req.user.sub);
    return this.recruitmentService.createJob(orgId, dto);
  }

  @Patch('jobs/:id')
  @ApiOperation({ summary: 'Update a job posting' })
  async updateJob(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
    @Body() dto: UpdateJobPostingDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.recruitmentService.getOrganizationId(req.user.sub);
    return this.recruitmentService.updateJob(orgId, id, dto);
  }

  @Get('candidates')
  @ApiOperation({ summary: 'Get all candidates' })
  async findAllCandidates(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.recruitmentService.getOrganizationId(req.user.sub);
    return this.recruitmentService.findAllCandidates(orgId);
  }

  @Post('candidates')
  @ApiOperation({ summary: 'Create a new candidate' })
  async createCandidate(@Req() req: { user?: { sub?: string } }, @Body() dto: CreateCandidateDto) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.recruitmentService.getOrganizationId(req.user.sub);
    return this.recruitmentService.createCandidate(orgId, dto);
  }

  @Patch('candidates/:id')
  @ApiOperation({ summary: 'Update a candidate' })
  async updateCandidate(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
    @Body() dto: UpdateCandidateDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.recruitmentService.getOrganizationId(req.user.sub);
    return this.recruitmentService.updateCandidate(orgId, id, dto);
  }

  @Delete('candidates/:id')
  @ApiOperation({ summary: 'Delete a candidate' })
  async removeCandidate(@Req() req: { user?: { sub?: string } }, @Param('id') id: string) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.recruitmentService.getOrganizationId(req.user.sub);
    return this.recruitmentService.deleteCandidate(orgId, id);
  }
}
