import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a sample website
  const website = await prisma.website.create({
    data: {
      name: 'Sample Website',
      domain: 'example.com',
    },
  });
  
  console.log('✅ Sample website created:', website);
  console.log('🔑 Website ID:', website.id);
  console.log('📝 Use this ID in your tracking script');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });