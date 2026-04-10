import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFinanceDto, UpdateFinanceDto } from './dto/finance.dto';

@Injectable()
export class FinanceService {
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

  async findAll(organizationId: string, type?: string) {
    return this.prisma.financialTransaction.findMany({
      where: { 
        organizationId,
        ...(type && { type })
      },
      include: { partner: { select: { name: true, type: true } } },
      orderBy: { date: 'desc' },
    });
  }

  async create(organizationId: string, dto: CreateFinanceDto) {
    return this.prisma.financialTransaction.create({
      data: { ...dto, organizationId, date: dto.date ? new Date(dto.date) : new Date() },
    });
  }

  async update(organizationId: string, id: string, dto: UpdateFinanceDto) {
    const transaction = await this.prisma.financialTransaction.findFirst({ where: { id, organizationId } });
    if (!transaction) throw new NotFoundException('Transaction not found');

    return this.prisma.financialTransaction.update({
      where: { id },
      data: { 
        ...dto, 
        ...(dto.date && { date: new Date(dto.date) })
      },
    });
  }

  async getStats(organizationId: string) {
    const transactions = await this.prisma.financialTransaction.findMany({ where: { organizationId } });
    
    const receivables = transactions.filter(t => t.type === 'INVOICE' && t.status !== 'Paid');
    const payables = transactions.filter(t => t.type === 'PURCHASE_ORDER' && t.status !== 'Paid');

    return {
      totalReceivables: receivables.reduce((sum, t) => sum + t.amount, 0),
      totalPayables: payables.reduce((sum, t) => sum + t.amount, 0),
      count: transactions.length
    };
  }
}
