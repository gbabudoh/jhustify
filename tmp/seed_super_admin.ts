import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'adminacess1@jhustify.com';
  const password = 'passcode2026';
  const name = 'JHUSTIFY SUPER ADMIN';

  console.log('Seeding super admin...');

  const exists = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (exists) {
    console.log('Super admin already exists.');
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: 'SUPER_ADMIN' as import('@prisma/client').Role,
    }
  });

  console.log(`Super admin created: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
