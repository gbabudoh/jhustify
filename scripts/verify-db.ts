import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Verifying Database Records ---');

  const userCount = await prisma.user.count();
  const businessCount = await prisma.business.count();
  const subscriptionCount = await prisma.subscription.count();
  const verificationCount = await prisma.verification.count();

  console.log(`Total Users: ${userCount}`);
  console.log(`Total Businesses: ${businessCount}`);
  console.log(`Total Subscriptions: ${subscriptionCount}`);
  console.log(`Total Verifications: ${verificationCount}`);

  const roles = await prisma.user.groupBy({
    by: ['role'],
    _count: {
      role: true,
    },
  });

  console.log('\nUsers by Role:');
  roles.forEach((r) => {
    console.log(`- ${r.role}: ${r._count.role}`);
  });

  console.log('--- Verification Completed ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
