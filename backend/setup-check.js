const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function checkSetup() {
  console.log('🔍 Checking backend setup...\n');

  // Check environment variables
  console.log('Environment Variables:');
  console.log('✓ PORT:', process.env.PORT || '3001 (default)');
  console.log('✓ NODE_ENV:', process.env.NODE_ENV || 'development (default)');
  console.log('✓ FRONTEND_URL:', process.env.FRONTEND_URL || 'http://localhost:3003 (default)');
  console.log('✓ DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('✓ JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
  
  if (!process.env.DATABASE_URL) {
    console.log('\n❌ DATABASE_URL is missing!');
    console.log('📋 Steps to fix:');
    console.log('1. Create Railway PostgreSQL database');
    console.log('2. Copy DATABASE_URL from Railway dashboard');
    console.log('3. Create backend/.env file with DATABASE_URL');
    return;
  }

  // Test database connection
  console.log('\n🔗 Testing database connection...');
  
  try {
    const prisma = new PrismaClient();
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Check if tables exist
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ Database schema ready (${userCount} users found)`);
    } catch (error) {
      console.log('⚠️  Database schema not initialized yet');
      console.log('Run: pnpx prisma db push');
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    console.log('\n📋 Troubleshooting:');
    console.log('1. Verify DATABASE_URL is correct');
    console.log('2. Check Railway database is running');
    console.log('3. Try: pnpx prisma generate');
  }

  console.log('\n🚀 Next steps:');
  console.log('1. If database connection failed, fix DATABASE_URL');
  console.log('2. Run: pnpx prisma db push (to create tables)');
  console.log('3. Run: pnpm dev (to start backend server)');
  console.log('4. Test: http://localhost:3001/health');
}

checkSetup().catch(console.error); 