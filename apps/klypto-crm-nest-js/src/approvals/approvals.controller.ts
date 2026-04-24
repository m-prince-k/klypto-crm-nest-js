import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApprovalsService } from './approvals.service';
import { ApprovalActionDto } from './dto/approval.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

@ApiTags('Approvals')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('approvals')
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Get('pending')
  @ApiOperation({ summary: 'Get all pending approvals across the platform' })
  async findPending(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.approvalsService.getOrganizationId(req.user.sub);
    return this.approvalsService.findPending(orgId);
  }

  @Post('action')
  @ApiOperation({ summary: 'Process an approval action (Approve/Reject)' })
  async processAction(
    @Req() req: { user?: { sub?: string } },
    @Body() dto: ApprovalActionDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.approvalsService.getOrganizationId(req.user.sub);
    return this.approvalsService.processAction(orgId, dto);
  }
}
