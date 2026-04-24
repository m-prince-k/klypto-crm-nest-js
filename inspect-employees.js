const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const employees = await prisma.employee.findMany({
    take: 5,
    select: { id: true, name: true, code: true }
  });
  console.log('Employees found:', JSON.stringify(employees, null, 2));
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
