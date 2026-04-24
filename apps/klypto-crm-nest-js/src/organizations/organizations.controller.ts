import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { UpdateOrganizationDto } from './dto/organization.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

@ApiTags('Organizations')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get organization profile' })
  async getProfile(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.organizationsService.getOrganizationId(
      req.user.sub,
    );
    return this.organizationsService.getProfile(orgId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update organization profile' })
  async updateProfile(
    @Req() req: { user?: { sub?: string } },
    @Body() dto: UpdateOrganizationDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.organizationsService.getOrganizationId(
      req.user.sub,
    );
    return this.organizationsService.updateProfile(orgId, dto);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get detailed organizational stats' })
  async getStats(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.organizationsService.getOrganizationId(
      req.user.sub,
    );
    return this.organizationsService.getDetailedStats(orgId);
  }
}
