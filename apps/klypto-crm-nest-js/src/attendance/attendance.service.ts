import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendanceDto, UpdateAttendanceDto } from './dto/attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async getOrganizationId(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { organizationId: true },
    });
    if (!user || !user.organizationId) {
      throw new UnauthorizedException('Invalid user context');
    }
    return user.organizationId;
  }

  async findAll(organizationId: string, dateStr?: string) {
    let dateFilter: any = undefined;
    if (dateStr) {
      const date = new Date(dateStr);
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);

      dateFilter = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const records = await this.prisma.attendanceRecord.findMany({
      where: {
        organizationId,
        ...(dateFilter && { date: dateFilter }),
      },
      include: {
        employee: true,
      },
      orderBy: {
        employee: {
          name: 'asc'
        }
      },
    });
    return records;
  }

  async findOne(organizationId: string, id: string) {
    const record = await this.prisma.attendanceRecord.findFirst({
      where: { id, organizationId },
      include: { employee: true },
    });
    if (!record) throw new NotFoundException('Attendance record not found');
    return record;
  }

  async create(organizationId: string, dto: CreateAttendanceDto) {
    const date = dto.date ? new Date(dto.date) : new Date();

    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existing = await this.prisma.attendanceRecord.findFirst({
      where: {
        organizationId,
        employeeId: dto.employeeId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (existing) {
      return this.update(organizationId, existing.id, dto);
    }

    // Set the canonical date to midnight so the composite unique constraint functions well
    const canonicalDate = new Date(date);
    canonicalDate.setUTCHours(12, 0, 0, 0);

    return this.prisma.attendanceRecord.create({
      data: {
        organizationId,
        employeeId: dto.employeeId,
        date: canonicalDate,
        status: dto.status,
        checkIn: dto.checkIn ? new Date(dto.checkIn) : null,
        checkOut: dto.checkOut ? new Date(dto.checkOut) : null,
      },
      include: { employee: true },
    });
  }

  async update(organizationId: string, id: string, dto: UpdateAttendanceDto) {
    await this.findOne(organizationId, id);

    const updateData: any = {};
    if (dto.status) updateData.status = dto.status;
    if (dto.checkIn) updateData.checkIn = new Date(dto.checkIn);
    if (dto.checkOut) updateData.checkOut = new Date(dto.checkOut);

    return this.prisma.attendanceRecord.update({
      where: { id },
      data: updateData,
      include: { employee: true },
    });
  }
}
