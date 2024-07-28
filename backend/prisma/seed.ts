import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  try {
    // Add your seed data here
    // Example: await prisma.user.create({ data: { name: 'John Doe', email: 'john@example.com' } });

    // Add more seed data as needed

    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((error) => console.error('Error running seed:', error));
