import { Module } from '@nestjs/common';
import { ErpOverviewService } from './erp-overview.service';
import { ErpOverviewController } from './erp-overview.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ErpOverviewController],
  providers: [ErpOverviewService],
})
export class ErpOverviewModule {}
