import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Generate a secure 16-character password
function generateSecurePassword(): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  
  let password = '';
  
  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the remaining 12 characters randomly
  const allChars = uppercase + lowercase + numbers + symbols;
  for (let i = 4; i < 16; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password to randomize the order
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');
    
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'isak@maxyourpoints.com' }
    });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email);
      console.log('📧 Email:', existingAdmin.email);
      console.log('🎭 Role:', existingAdmin.role);
      console.log('📅 Created:', existingAdmin.createdAt);
      return;
    }
    
    // Generate secure password
    const plainPassword = generateSecurePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 12);
    
    // Create the first admin user
    const adminUser = await prisma.user.create({
      data: {
        email: 'isak@maxyourpoints.com',
        password: hashedPassword,
        name: 'Isak Parild',
        fullName: 'Isak Parild',
        role: 'SUPER_ADMIN',
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });
    
    console.log('🎉 Successfully created admin user!');
    console.log('');
    console.log('==========================================');
    console.log('🔐 ADMIN CREDENTIALS - SAVE THESE SECURELY');
    console.log('==========================================');
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 Password:', plainPassword);
    console.log('🎭 Role:', adminUser.role);
    console.log('🆔 User ID:', adminUser.id);
    console.log('📅 Created:', adminUser.createdAt);
    console.log('==========================================');
    console.log('⚠️  IMPORTANT: Save this password now!');
    console.log('⚠️  It will not be shown again.');
    console.log('==========================================');
    
    // Create some basic categories
    const categories = [
      {
        name: 'Airlines & Aviation',
        slug: 'airlines-aviation',
        description: 'Flight experiences, airline reviews, and aviation insights',
        featured: true
      },
      {
        name: 'Credit Cards & Points',
        slug: 'credit-cards-points',
        description: 'Credit card reviews, points strategies, and earning tips',
        featured: true
      },
      {
        name: 'Hotels & Trip Reports',
        slug: 'hotels-trip-reports',
        description: 'Hotel reviews, trip reports, and accommodation insights',
        featured: true
      },
      {
        name: 'Travel Hacks & Deals',
        slug: 'travel-hacks-deals',
        description: 'Travel tips, deals, and money-saving strategies',
        featured: true
      }
    ];
    
    console.log('\n📂 Creating default categories...');
    
    for (const categoryData of categories) {
      const existingCategory = await prisma.category.findUnique({
        where: { slug: categoryData.slug }
      });
      
      if (!existingCategory) {
        const category = await prisma.category.create({
          data: categoryData
        });
        console.log(`✅ Created category: ${category.name}`);
      } else {
        console.log(`⏭️  Category already exists: ${existingCategory.name}`);
      }
    }
    
    console.log('\n🎯 Database seeding completed successfully!');
    console.log('🚀 You can now log in to the admin panel with the credentials above.');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
if (require.main === module) {
  seedDatabase()
    .catch((error) => {
      console.error('💥 Seed script failed:', error);
      process.exit(1);
    });
}

export default seedDatabase; 