import connectDB from '../lib/db';
import User from '../lib/models/User';
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

    await connectDB();
    console.log('\nConnected to database...');

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`\nUser with email ${email} already exists.`);
      const update = await question('Do you want to update this user to ADMIN role? (y/n): ');
      if (update.toLowerCase() === 'y') {
        existingUser.role = 'ADMIN';
        if (password) {
          existingUser.password = password; // Will be hashed by pre-save hook
        }
        await existingUser.save();
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
    const admin = await User.create({
      email,
      password,
      name,
      role: 'ADMIN',
    });

    console.log('\n✓ Admin user created successfully!');
    console.log(`\nAdmin Login Credentials:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`\nYou can now login at: http://localhost:3000/admin/login`);
    
    rl.close();
    process.exit(0);
  } catch (error: any) {
    console.error('\n✗ Error creating admin user:', error.message);
    rl.close();
    process.exit(1);
  }
}

createAdmin();

