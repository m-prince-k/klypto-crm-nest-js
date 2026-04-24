const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  const logs = await prisma.biometricLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1
  });
  
  const attendance = await prisma.attendanceRecord.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1,
    include: { employee: { select: { name: true, code: true } } }
  });

  console.log('--- BiometricLog ---');
  console.log(JSON.stringify(logs, null, 2));
  
  console.log('\n--- AttendanceRecord ---');
  console.log(JSON.stringify(attendance, null, 2));

  process.exit(0);
}

verify().catch(e => {
  console.error(e);
  process.exit(1);
});
