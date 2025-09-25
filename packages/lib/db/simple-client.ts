// Dynamic Prisma client to avoid initialization during build
let prismaInstance: any = null;

export const prisma = new Proxy({} as any, {
  get(target, prop) {
    if (!process.env.DATABASE_URL) {
      throw new Error('Database not available during build time');
    }
    
    if (!prismaInstance) {
      // Dynamically import and create Prisma client only when needed
      const { PrismaClient } = require('@prisma/client');
      prismaInstance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
    }
    
    return prismaInstance[prop];
  }
});

// Simplified query execution for build compatibility
export async function executeQuery<T>(
  queryFn: (client: any) => Promise<T>
): Promise<T> {
  return await queryFn(prisma);
}

// Simplified batch execution
export async function executeBatchQueries<T>(
  queries: Array<(client: any) => Promise<T>>
): Promise<T[]> {
  const results: T[] = [];
  for (const queryFn of queries) {
    const result = await executeQuery(queryFn);
    results.push(result);
  }
  return results;
}

export default prisma;
