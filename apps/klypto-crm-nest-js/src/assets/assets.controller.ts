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
import { AssetsService } from './assets.service';
import { CreateAssetDto, UpdateAssetDto } from './dto/asset.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

@ApiTags('Assets')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all assets' })
  async findAll(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.assetsService.getOrganizationId(req.user.sub);
    return this.assetsService.findAll(orgId);
  }

  @Post()
  @ApiOperation({ summary: 'Add a new asset' })
  async create(
    @Req() req: { user?: { sub?: string } },
    @Body() dto: CreateAssetDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.assetsService.getOrganizationId(req.user.sub);
    return this.assetsService.create(orgId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an asset' })
  async update(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
    @Body() dto: UpdateAssetDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.assetsService.getOrganizationId(req.user.sub);
    return this.assetsService.update(orgId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an asset' })
  async remove(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.assetsService.getOrganizationId(req.user.sub);
    return this.assetsService.delete(orgId, id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get asset statistics' })
  async getStats(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.assetsService.getOrganizationId(req.user.sub);
    return this.assetsService.getStats(orgId);
  }
}
