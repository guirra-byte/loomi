import { PrismaClient } from '@prisma/client';
import { config } from "dotenv";

config();
const { DATABASE_URL } = process.env;

let prisma: PrismaClient | null = null;
const getPrismaClient = () => {
  if (!prisma) {

    prisma = new PrismaClient({
      datasources: {
        db: {
          url: DATABASE_URL,
        },
      },
      log: ['warn', 'error'],
    });

    prisma.$connect().catch((err: Error) => {
      console.error('Failed to connect to database:', err);
      process.exit(1);
    });

    const gracefulShutdown = async () => {
      console.log('Closing database connection...');
      await prisma?.$disconnect();
      process.exit(0);
    };

    process.on('beforeExit', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
  }

  return prisma;
};

export default getPrismaClient();
