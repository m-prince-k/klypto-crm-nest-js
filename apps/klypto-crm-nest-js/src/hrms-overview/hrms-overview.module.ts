import { Module } from '@nestjs/common';
import { HrmsOverviewService } from './hrms-overview.service';
import { HrmsOverviewController } from './hrms-overview.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HrmsOverviewController],
  providers: [HrmsOverviewService],
  exports: [HrmsOverviewService],
})
export class HrmsOverviewModule {}
