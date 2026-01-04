const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

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

async function createDefaultAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('✗ MONGODB_URI not found in environment variables!');
      console.error('Please make sure .env.local file exists with MONGODB_URI configured.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✓ Connected to database...\n');

    // Default super admin credentials
    const adminEmail = 'admin@jhustify.com';
    const adminPassword = 'Admin@123456';
    const adminName = 'Super Admin';

    // Check if admin already exists
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      if (existingUser.role === 'ADMIN') {
        console.log('✓ Admin user already exists!');
        console.log('\n═══════════════════════════════════════');
        console.log('   SUPER ADMIN LOGIN CREDENTIALS');
        console.log('═══════════════════════════════════════');
        console.log(`   Email:    ${adminEmail}`);
        console.log(`   Password: ${adminPassword}`);
        console.log('═══════════════════════════════════════\n');
        console.log(`Login URL: http://localhost:3000/admin/login\n`);
        await mongoose.disconnect();
        process.exit(0);
      } else {
        // Update existing user to admin
        existingUser.role = 'ADMIN';
        existingUser.password = adminPassword; // Will be hashed by pre-save hook
        existingUser.name = adminName;
        await existingUser.save();
        console.log('✓ Existing user updated to SUPER ADMIN role!');
      }
    } else {
      // Create new admin user
      await User.create({
        email: adminEmail,
        password: adminPassword,
        name: adminName,
        role: 'ADMIN',
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
    console.log('⚠️  SECURITY WARNING:');
    console.log('   Change this password immediately after first login!');
    console.log('   This is a default password for initial setup only.\n');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Error creating admin user:', error.message);
    if (error.code === 11000) {
      console.error('   A user with this email already exists.');
    }
    await mongoose.disconnect();
    process.exit(1);
  }
}

createDefaultAdmin();

