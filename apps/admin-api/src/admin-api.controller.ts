import { Controller, Get } from '@nestjs/common';
import { AdminApiService } from './admin-api.service';
import { PrismaService } from './prisma/prisma.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin-Test')
@Controller('admin')
export class AdminApiController {
  constructor(
    private readonly adminApiService: AdminApiService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('hello')
  @ApiOperation({ summary: 'Basic hello world' })
  getHello(): string {
    return this.adminApiService.getHello();
  }

  @Get('count')
  @ApiOperation({ summary: 'Count admins in database' })
  async countAdmins() {
    const count = await this.prisma.admin.count();
    return { count };
  }
}
