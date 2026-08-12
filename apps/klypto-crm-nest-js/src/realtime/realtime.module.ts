import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AttendanceGateway } from './attendance.gateway';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  providers: [AttendanceGateway],
  exports: [AttendanceGateway],
})
export class RealtimeModule {}
