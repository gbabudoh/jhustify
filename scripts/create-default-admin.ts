import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// No need to manually load dotenv if using tsx with --env-file or just relying on Next.js env loading
// But for standalone scripts, we can use:
import 'dotenv/config'; 

const prisma = new PrismaClient();

async function createDefaultAdmin() {
  try {
    console.log('=== Create Default Admin (Prisma/TS) ===\n');

    // Default super admin credentials
    const adminEmail = 'admin@jhustify.com';
    const adminPassword = 'Admin@123456';
    const adminName = 'Super Admin';

    // Check if admin already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    if (existingUser) {
      if (existingUser.role === 'ADMIN') {
        console.log('✓ Admin user already exists!');
      } else {
        // Update existing user to admin
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            role: 'ADMIN',
            password: hashedPassword,
            name: adminName
          }
        });
        console.log('✓ Existing user updated to ADMIN role!');
      }
    } else {
      // Create new admin user
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: adminName,
          role: 'ADMIN',
        },
      });
      console.log('✓ Super admin user created successfully!');
    }

    console.log('\n═══════════════════════════════════════');
    console.log('   SUPER ADMIN LOGIN CREDENTIALS');
    console.log('═══════════════════════════════════════');
    console.log(`   Email:    ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('═══════════════════════════════════════\n');
    console.log(`Login URL: http://localhost:3000/admin/login\n`);
    
    process.exit(0);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('\n✗ Error creating admin user:', errorMessage);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createDefaultAdmin();
