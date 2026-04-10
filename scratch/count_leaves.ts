import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.leaveRequest.count();
  console.log('Total Leave Requests:', count);
}
main().catch(console.error).finally(() => prisma.$disconnect());
