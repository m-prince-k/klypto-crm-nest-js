import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { ResignationController } from './resignation.controller';
import { ResignationService } from './resignation.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EmployeesController, ResignationController],
  providers: [EmployeesService, ResignationService],
})
export class EmployeesModule {}
