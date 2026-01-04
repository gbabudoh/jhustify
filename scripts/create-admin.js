const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  name: { type: String, required: true },
  role: { type: String, enum: ['BUSINESS_OWNER', 'CONSUMER', 'ADMIN', 'TRUST_TEAM'], default: 'BUSINESS_OWNER' },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

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

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI not found in environment variables!');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
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
        await mongoose.disconnect();
        process.exit(0);
      } else {
        console.log('Operation cancelled.');
        rl.close();
        await mongoose.disconnect();
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
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Error creating admin user:', error.message);
    rl.close();
    await mongoose.disconnect();
    process.exit(1);
  }
}

createAdmin();

