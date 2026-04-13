import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const employees = await prisma.employee.findMany();
  console.log('Employees:', employees.map(e => ({ id: e.id, name: e.name, org: e.organizationId })));
}
main().catch(console.error).finally(() => prisma.$disconnect());
