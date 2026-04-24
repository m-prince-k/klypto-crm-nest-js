import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResignationService } from './resignation.service';
import { CreateResignationDto, UpdateResignationStatusDto } from './dto/resignation.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

@ApiTags('Resignations')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('hr-resignations')
export class ResignationController {
  constructor(private readonly resignationService: ResignationService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a resignation request' })
  async create(
    @Req() req: { user?: { sub?: string } },
    @Body() dto: CreateResignationDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.resignationService.getOrganizationId(req.user.sub);
    return this.resignationService.create(orgId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all resignation requests' })
  async findAll(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.resignationService.getOrganizationId(req.user.sub);
    return this.resignationService.findAll(orgId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get resignation details' })
  async findOne(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.resignationService.getOrganizationId(req.user.sub);
    return this.resignationService.findOne(orgId, id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update resignation status (Approval/FNF)' })
  async updateStatus(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
    @Body() dto: UpdateResignationStatusDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.resignationService.getOrganizationId(req.user.sub);
    return this.resignationService.updateStatus(orgId, id, dto);
  }
}
