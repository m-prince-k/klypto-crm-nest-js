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
import { PartnersService } from './partners.service';
import { CreatePartnerDto, UpdatePartnerDto } from './dto/partner.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

@ApiTags('Partners')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all partners' })
  async findAll(
    @Req() req: { user?: { sub?: string } },
    @Query('type') type?: string,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.partnersService.getOrganizationId(req.user.sub);
    return this.partnersService.findAll(orgId, type);
  }

  @Post()
  @ApiOperation({ summary: 'Add a new partner' })
  async create(
    @Req() req: { user?: { sub?: string } },
    @Body() dto: CreatePartnerDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.partnersService.getOrganizationId(req.user.sub);
    return this.partnersService.create(orgId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update partner details' })
  async update(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
    @Body() dto: UpdatePartnerDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.partnersService.getOrganizationId(req.user.sub);
    return this.partnersService.update(orgId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a partner' })
  async remove(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.partnersService.getOrganizationId(req.user.sub);
    return this.partnersService.delete(orgId, id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get partner statistics' })
  async getStats(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.partnersService.getOrganizationId(req.user.sub);
    return this.partnersService.getStats(orgId);
  }
}
