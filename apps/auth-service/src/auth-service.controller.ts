import { Controller, Get } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { PrismaService } from './prisma/prisma.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth-Test')
@Controller('auth-test')
export class AuthServiceController {
  constructor(
    private readonly authServiceService: AuthServiceService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('hello')
  @ApiOperation({ summary: 'Basic hello world' })
  getHello(): string {
    return this.authServiceService.getHello();
  }

  @Get('count')
  @ApiOperation({ summary: 'Count auth users in database' })
  async countUsers() {
    const count = await this.prisma.authUser.count();
    return { count };
  }
}
