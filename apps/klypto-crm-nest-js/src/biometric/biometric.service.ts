import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AttendanceService } from '../attendance/attendance.service';

@Injectable()
export class BiometricService {
  private readonly logger = new Logger(BiometricService.name);

  constructor(
    private prisma: PrismaService,
    private attendanceService: AttendanceService,
  ) {}

  async processIncomingData(deviceSn: string, table: string, rawData: string) {
    if (table !== 'ATTLOG') {
      this.logger.log(
        `Received non-ATTLOG data for table: ${table}. Skipping processing.`,
      );
      return 'OK';
    }

    const lines = rawData.trim().split(/\r?\n/);
    this.logger.log(
      `Processing ${lines.length} log entries from device ${deviceSn}`,
    );

    for (const line of lines) {
      if (!line.trim()) continue;

      const [userId, timestampStr, status] = line.split('\t');
      
      // SKIP OLD RECORDS: Only process data from April 23rd, 2026 onwards
      if (timestampStr && timestampStr < '2026-04-23') {
        continue; 
      }

      this.logger.log(`Parsed line: userId=${userId}, timestamp=${timestampStr}, status=${status}`);

      try {
        // ZKTeco machine sends timestamps in its local time (IST).
        // Appending +05:30 ensures Node.js parses it accurately without timezone drift.
        const punchTime = new Date(timestampStr.replace(' ', 'T') + '+05:30'); 
        this.logger.log(`Calculated punch time: ${punchTime.toISOString()}`);

        // Save raw log first
        this.logger.log(`Saving biometric log...`);
        await this.prisma.biometricLog.create({
          data: {
            deviceSn,
            empCode: userId,
            punchTime,
            punchType: status,
            rawLog: line,
          },
        });
        this.logger.log(`Biometric log saved. Finding employee...`);

        // Find employee by code
        const employee = await this.prisma.employee.findUnique({
          where: { code: userId },
          include: { organization: true },
        });
        
        this.logger.log(`Employee lookup returned: ${employee ? employee.id : 'null'}`);

        if (!employee) {
          this.logger.warn(`Employee with code ${userId} not found in CRM.`);
          continue;
        }

        // Smart Punch Logic: We pass the timestamp to both checkIn and checkOut.
        // The attendance service's First-In, Last-Out logic will automatically
        // preserve the earliest punch as the Check-In and the latest punch as the Check-Out.
        const attendanceDto = {
          employeeId: employee.id,
          date: punchTime.toISOString().split('T')[0],
          status: 'Present',
          checkIn: punchTime.toISOString(),
          checkOut: punchTime.toISOString(),
        };

        await this.attendanceService.create(
          employee.organizationId,
          attendanceDto,
        );

        this.logger.log(
          `Processed attendance for ${employee.name} (${userId}) at ${timestampStr}`,
        );
      } catch (error) {
        this.logger.error(`Error processing line: ${line}`, error.stack);
      }
    }

    return 'OK';
  }

  async getRequests(deviceSn: string) {
    // Standard ADMS heartbeat response
    return 'OK';
  }
}
