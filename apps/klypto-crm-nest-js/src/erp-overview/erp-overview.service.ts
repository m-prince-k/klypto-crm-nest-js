import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ErpOverviewService {
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

  async getStats(organizationId: string) {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const [invoices, purchases, payrolls, assets] = await Promise.all([
      this.prisma.financialTransaction.findMany({
        where: { organizationId, type: 'INVOICE', date: { gte: sixMonthsAgo } },
      }),
      this.prisma.financialTransaction.findMany({
        where: {
          organizationId,
          type: 'PURCHASE_ORDER',
          date: { gte: sixMonthsAgo },
        },
      }),
      this.prisma.payrollRecord.findMany({
        where: { organizationId, createdAt: { gte: sixMonthsAgo } }, // Using createdAt as a proxy for run time
      }),
      this.prisma.asset.findMany({
        where: { organizationId },
      }),
    ]);

    // Calculate current totals
    const totalSales = invoices.reduce((sum, i) => sum + i.amount, 0);
    const operationalCost =
      purchases.reduce((sum, p) => sum + p.amount, 0) +
      payrolls.reduce((sum, pay) => sum + pay.netPay, 0);
    const netProfit = totalSales - operationalCost;
    const assetValuation = assets.reduce((sum, a) => sum + (a.value || 0), 0);

    // Monthly Performance Data (Last 6 Months)
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(now.getMonth() - i);
      const mLabel = d.toLocaleString('default', { month: 'short' });
      const mYear = d.getFullYear();
      const mMonth = d.getMonth();

      const mSales = invoices
        .filter((inv) => {
          const idate = new Date(inv.date);
          return idate.getMonth() === mMonth && idate.getFullYear() === mYear;
        })
        .reduce((sum, inv) => sum + inv.amount, 0);

      const mCost =
        purchases
          .filter((p) => {
            const pdate = new Date(p.date);
            return pdate.getMonth() === mMonth && pdate.getFullYear() === mYear;
          })
          .reduce((sum, p) => sum + p.amount, 0) +
        payrolls
          .filter((pay) => {
            // Payroll records have month/year fields
            return pay.month === mMonth + 1 && pay.year === mYear;
          })
          .reduce((sum, pay) => sum + pay.netPay, 0);

      months.push({
        label: mLabel,
        sales: mSales,
        cost: mCost,
        profit: mSales - mCost,
      });
    }

    // Operational Breakdown
    const breakdown = [
      { label: 'Procurement', val: purchases.length },
      { label: 'Payroll', val: payrolls.length },
      { label: 'Fixed Assets', val: assets.length },
      { label: 'Invoices', val: invoices.length },
    ];
    const totalCount = breakdown.reduce((sum, b) => sum + b.val, 0) || 1;
    const normalizedBreakdown = breakdown.map((b) => ({
      label: b.label,
      val: Math.round((b.val / totalCount) * 100),
      count: b.val,
    }));

    return {
      totalSales,
      operationalCost,
      netProfit,
      assetValuation,
      performance: months,
      breakdown: normalizedBreakdown,
    };
  }
}
