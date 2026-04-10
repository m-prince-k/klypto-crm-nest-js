import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto, UpdateAttendanceDto } from './dto/attendance.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

@ApiTags('Attendance')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create or update attendance record' })
  async create(
    @Req() req: { user?: { sub?: string } },
    @Body() createAttendanceDto: CreateAttendanceDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.attendanceService.getOrganizationId(req.user.sub);
    return this.attendanceService.create(orgId, createAttendanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get organization attendance' })
  async findAll(
    @Req() req: { user?: { sub?: string } },
    @Query('date') date?: string,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.attendanceService.getOrganizationId(req.user.sub);
    return this.attendanceService.findAll(orgId, date);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific attendance record' })
  async findOne(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.attendanceService.getOrganizationId(req.user.sub);
    return this.attendanceService.findOne(orgId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an attendance record' })
  async update(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.attendanceService.getOrganizationId(req.user.sub);
    return this.attendanceService.update(orgId, id, updateAttendanceDto);
  }
}
