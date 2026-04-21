import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { RbacModule } from './rbac/rbac.module';
import { EmployeesModule } from './employees/employees.module';
import { AttendanceModule } from './attendance/attendance.module';
import { LeavesModule } from './leaves/leaves.module';
import { PayrollModule } from './payroll/payroll.module';
import { PerformanceModule } from './performance/performance.module';
import { HrmsOverviewModule } from './hrms-overview/hrms-overview.module';
import { LeadsModule } from './leads/leads.module';
import { CrmOverviewModule } from './crm-overview/crm-overview.module';
import { RecruitmentModule } from './recruitment/recruitment.module';
import { GrievancesModule } from './grievances/grievances.module';
import { ProjectsModule } from './projects/projects.module';
import { AssetsModule } from './assets/assets.module';
import { PartnersModule } from './partners/partners.module';
import { FinanceModule } from './finance/finance.module';
import { EntitiesModule } from './entities/entities.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { ErpOverviewModule } from './erp-overview/erp-overview.module';
import { PoliciesModule } from './policies/policies.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    RbacModule,
    UsersModule,
    EmployeesModule,
    AttendanceModule,
    LeavesModule,
    PayrollModule,
    PerformanceModule,
    HrmsOverviewModule,
    LeadsModule,
    CrmOverviewModule,
    RecruitmentModule,
    GrievancesModule,
    ProjectsModule,
    AssetsModule,
    PartnersModule,
    FinanceModule,
    EntitiesModule,
    OrganizationsModule,
    ApprovalsModule,
    ErpOverviewModule,
    PoliciesModule,
    MailModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST || 'smtp.example.com',
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER || 'user@example.com',
          pass: process.env.SMTP_PASS || 'password',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@klyptocrm.com>',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
