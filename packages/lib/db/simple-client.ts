import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Simplified query execution for build compatibility
export async function executeQuery<T>(
  queryFn: (client: PrismaClient) => Promise<T>
): Promise<T> {
  return await queryFn(prisma);
}

// Simplified batch execution
export async function executeBatchQueries<T>(
  queries: Array<(client: PrismaClient) => Promise<T>>
): Promise<T[]> {
  const results: T[] = [];
  for (const queryFn of queries) {
    const result = await executeQuery(queryFn);
    results.push(result);
  }
  return results;
}

export default prisma;
