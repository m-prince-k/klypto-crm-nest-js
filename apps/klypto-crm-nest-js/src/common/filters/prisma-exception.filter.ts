import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter<Prisma.PrismaClientKnownRequestError> {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const code = exception.code;
    let status = HttpStatus.BAD_REQUEST;
    let message = 'Database request failed';

    const normalizeFieldLabel = (value: string) => {
      const raw = value || '';
      if (raw.includes('Branch_headId_fkey')) {
        return 'selected branch head';
      }
      if (raw.includes('Department_headId_fkey')) {
        return 'selected department head';
      }
      if (raw.includes('FinancialTransaction_partnerId_fkey')) {
        return 'linked financial transactions';
      }
      if (raw.includes('AttendanceRecord_employeeId_fkey')) {
        return 'linked attendance records';
      }

      return raw;
    };

    if (code === 'P2002') {
      const fields = Array.isArray(exception.meta?.target)
        ? exception.meta?.target.join(', ')
        : 'unique field';
      message = `${fields} already exists. Please use a different value.`;
    } else if (code === 'P2003') {
      const field = normalizeFieldLabel(
        String(exception.meta?.field_name || 'related data'),
      );
      message = `Cannot complete action because ${field} is invalid or still linked.`;
    } else if (code === 'P2025') {
      status = HttpStatus.NOT_FOUND;
      message = 'Requested record does not exist';
    }

    response.status(status).json({
      statusCode: status,
      message,
      code,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
