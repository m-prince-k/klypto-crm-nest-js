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
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import {
  CreateLeadDto,
  UpdateLeadDto,
  CreateLeadNoteDto,
} from './dto/lead.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

@ApiTags('Leads')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all leads' })
  async findAll(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.leadsService.getOrganizationId(req.user.sub);
    return this.leadsService.findAll(orgId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lead details' })
  async findOne(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.leadsService.getOrganizationId(req.user.sub);
    return this.leadsService.findOne(orgId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new lead' })
  async create(
    @Req() req: { user?: { sub?: string } },
    @Body() dto: CreateLeadDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.leadsService.getOrganizationId(req.user.sub);
    return this.leadsService.create(orgId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a lead' })
  async update(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
    @Body() dto: UpdateLeadDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.leadsService.getOrganizationId(req.user.sub);
    return this.leadsService.update(orgId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lead' })
  async remove(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.leadsService.getOrganizationId(req.user.sub);
    return this.leadsService.delete(orgId, id);
  }

  @Post(':id/notes')
  @ApiOperation({ summary: 'Add a note to a lead' })
  async addNote(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
    @Body() dto: CreateLeadNoteDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.leadsService.getOrganizationId(req.user.sub);
    return this.leadsService.addNote(orgId, id, dto);
  }

  @Get(':id/notes')
  @ApiOperation({ summary: 'Get notes for a lead' })
  async getNotes(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.leadsService.getOrganizationId(req.user.sub);
    return this.leadsService.getNotes(orgId, id);
  }
}
