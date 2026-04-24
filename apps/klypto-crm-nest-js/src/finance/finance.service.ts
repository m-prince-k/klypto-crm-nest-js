import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFinanceDto, UpdateFinanceDto } from './dto/finance.dto';
import { CreateReimbursementDto, UpdateReimbursementStatusDto } from './dto/reimbursement.dto';

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
        ...(type && { type }),
      },
      include: { partner: { select: { name: true, type: true } } },
      orderBy: { date: 'desc' },
    });
  }

  async create(organizationId: string, dto: CreateFinanceDto) {
    return this.prisma.financialTransaction.create({
      data: {
        ...dto,
        organizationId,
        date: dto.date ? new Date(dto.date) : new Date(),
      },
    });
  }

  async update(organizationId: string, id: string, dto: UpdateFinanceDto) {
    const transaction = await this.prisma.financialTransaction.findFirst({
      where: { id, organizationId },
    });
    if (!transaction) throw new NotFoundException('Transaction not found');

    return this.prisma.financialTransaction.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.date && { date: new Date(dto.date) }),
      },
    });
  }

  async delete(organizationId: string, id: string) {
    const transaction = await this.prisma.financialTransaction.findFirst({
      where: { id, organizationId },
    });
    if (!transaction) throw new NotFoundException('Transaction not found');

    return this.prisma.financialTransaction.delete({ where: { id } });
  }

  async getStats(organizationId: string) {
    const transactions = await this.prisma.financialTransaction.findMany({
      where: { organizationId },
    });

    const receivables = transactions.filter(
      (t) => t.type === 'INVOICE' && t.status !== 'Paid',
    );
    const payables = transactions.filter(
      (t) => t.type === 'PURCHASE_ORDER' && t.status !== 'Paid',
    );

    return {
      totalReceivables: receivables.reduce((sum, t) => sum + t.amount, 0),
      totalPayables: payables.reduce((sum, t) => sum + t.amount, 0),
      count: transactions.length,
    };
  }

  // --- REIMBURSEMENT METHODS ---

  async createReimbursement(organizationId: string, dto: CreateReimbursementDto) {
    return this.prisma.reimbursement.create({
      data: {
        ...dto,
        organizationId,
        date: dto.date ? new Date(dto.date) : new Date(),
      },
      include: { employee: { select: { name: true, code: true } } },
    });
  }

  async findAllReimbursements(organizationId: string) {
    return this.prisma.reimbursement.findMany({
      where: { organizationId },
      include: { employee: { select: { name: true, code: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateReimbursementStatus(organizationId: string, id: string, dto: UpdateReimbursementStatusDto) {
    const reimbursement = await this.prisma.reimbursement.findFirst({
      where: { id, organizationId },
    });
    if (!reimbursement) throw new NotFoundException('Reimbursement request not found');

    return this.prisma.reimbursement.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async getReimbursementStats(organizationId: string) {
    const reimbursements = await this.prisma.reimbursement.findMany({
      where: { organizationId },
    });

    const pending = reimbursements.filter(r => r.status === 'Pending');
    const reimbursed = reimbursements.filter(r => r.status === 'Reimbursed');

    return {
      pendingExpenses: pending.reduce((sum: number, r: any) => sum + r.amount, 0),
      totalReimbursed: reimbursed.reduce((sum: number, r: any) => sum + r.amount, 0),
      count: reimbursements.length,
    };
  }
}
