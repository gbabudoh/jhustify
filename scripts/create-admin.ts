import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createAdmin() {
  try {
    console.log('=== Create Admin User ===\n');
    
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 6 characters): ');
    const name = await question('Enter admin name: ');

    if (!email || !password || !name) {
      console.error('All fields are required!');
      process.exit(1);
    }

    if (password.length < 6) {
      console.error('Password must be at least 6 characters!');
      process.exit(1);
    }

    console.log('\nChecking database...');

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (existingUser) {
      console.log(`\nUser with email ${email} already exists.`);
      const update = await question('Do you want to update this user to ADMIN role? (y/n): ');
      if (update.toLowerCase() === 'y') {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            role: 'ADMIN',
            password: hashedPassword,
            name // Update name too if provided
          }
        });
        console.log('\n✓ User updated to ADMIN role successfully!');
        console.log(`\nAdmin Login Credentials:`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log(`\nYou can now login at: http://localhost:3000/admin/login`);
        rl.close();
        process.exit(0);
      } else {
        console.log('Operation cancelled.');
        rl.close();
        process.exit(0);
      }
    }

    // Create new admin user
    await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        role: 'ADMIN',
      },
    });

    console.log('\n✓ Admin user created successfully!');
    console.log(`\nAdmin Login Credentials:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`\nYou can now login at: http://localhost:3000/admin/login`);
    
    rl.close();
    process.exit(0);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('\n✗ Error creating admin user:', errorMessage);
    rl.close();
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
