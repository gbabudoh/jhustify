/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Database Seeding ---');

  // Clean up dummy accounts
  console.log('Removing dummy accounts...');
  await prisma.verification.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.business.deleteMany({});
  await prisma.user.deleteMany({
    where: {
      email: {
        notIn: [
          'adminacess1@jhustify.com',
          'admin@jhustify.com',
          'rukeorivo@gmail.com',
          'gbabudoh@gmail.com',
        ],
      },
    },
  });

  const salt = await bcrypt.genSalt(10);

  // 1. Keep Super Admins
  console.log('Seeding Super Admins...');
  const adminHash1 = await bcrypt.hash('passcode2026', salt);
  const adminHash2 = await bcrypt.hash('Admin@123456', salt);

  await prisma.user.upsert({
    where: { email: 'adminacess1@jhustify.com' },
    update: { password: adminHash1 },
    create: {
      email: 'adminacess1@jhustify.com',
      password: adminHash1,
      name: 'God Admin',
      role: 'SUPER_ADMIN' as any,
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@jhustify.com' },
    update: { password: adminHash2 },
    create: {
      email: 'admin@jhustify.com',
      password: adminHash2,
      name: 'Super Administrator',
      role: 'SUPER_ADMIN' as any,
    },
  });

  // 2. Business Owner - Ruke Orivo
  console.log('Seeding Business Owner...');
  const bizOwnerHash = await bcrypt.hash('g1vemeace$s1', salt);

  await prisma.user.upsert({
    where: { email: 'rukeorivo@gmail.com' },
    update: {},
    create: {
      email: 'rukeorivo@gmail.com',
      password: bizOwnerHash,
      name: 'Ruke Orivo',
      role: Role.BUSINESS_OWNER,
    },
  });

  // 3. Consumer - gbabudoh
  console.log('Seeding Consumer...');
  const consumerHash = await bcrypt.hash('G1vemeace$1', salt);

  await prisma.user.upsert({
    where: { email: 'gbabudoh@gmail.com' },
    update: {},
    create: {
      email: 'gbabudoh@gmail.com',
      password: consumerHash,
      name: 'Gbabudoh',
      role: Role.CONSUMER,
    },
  });

  console.log('--- Seeding Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
