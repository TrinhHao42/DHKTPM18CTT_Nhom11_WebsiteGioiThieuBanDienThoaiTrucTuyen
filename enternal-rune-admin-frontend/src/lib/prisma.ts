import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Ensure correct database URL for development - fallback to correct credentials
const databaseUrl = process.env.DATABASE_URL || 'postgresql://analytics_user:analytics_password@localhost:5432/analytics';

console.log('[Prisma] Database URL:', databaseUrl.replace(/\/\/.*@/, '//***:***@')); // Log URL without credentials

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;