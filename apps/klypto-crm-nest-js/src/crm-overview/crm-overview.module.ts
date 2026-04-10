import { Module } from '@nestjs/common';
import { CrmOverviewService } from './crm-overview.service';
import { CrmOverviewController } from './crm-overview.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CrmOverviewController],
  providers: [CrmOverviewService],
  exports: [CrmOverviewService],
})
export class CrmOverviewModule {}
