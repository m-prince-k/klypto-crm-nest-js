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
import { EmployeesService } from './employees.service';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeResponseDto,
} from './dto/employee.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

@ApiTags('Employees')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiCreatedResponse({
    description: 'The employee has been successfully created.',
    type: EmployeeResponseDto,
  })
  async create(
    @Req() req: { user?: { sub?: string } },
    @Body() createEmployeeDto: CreateEmployeeDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.employeesService.getOrganizationId(req.user.sub);
    return this.employeesService.create(orgId, createEmployeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all employees in the organization' })
  @ApiOkResponse({
    description: 'List of employees',
    type: [EmployeeResponseDto],
  })
  async findAll(@Req() req: { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.employeesService.getOrganizationId(req.user.sub);
    return this.employeesService.findAll(orgId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific employee by ID' })
  @ApiOkResponse({
    description: 'The employee details',
    type: EmployeeResponseDto,
  })
  async findOne(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.employeesService.getOrganizationId(req.user.sub);
    return this.employeesService.findOne(orgId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an employee' })
  @ApiOkResponse({
    description: 'The employee has been successfully updated.',
    type: EmployeeResponseDto,
  })
  async update(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.employeesService.getOrganizationId(req.user.sub);
    return this.employeesService.update(orgId, id, updateEmployeeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an employee' })
  @ApiOkResponse({ description: 'The employee has been deleted successfully.' })
  async remove(
    @Req() req: { user?: { sub?: string } },
    @Param('id') id: string,
  ) {
    if (!req.user?.sub) throw new UnauthorizedException('Invalid user context');
    const orgId = await this.employeesService.getOrganizationId(req.user.sub);
    return this.employeesService.remove(orgId, id);
  }
}
