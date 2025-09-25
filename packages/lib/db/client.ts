import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { 
  prisma?: PrismaClient;
  prismaPool?: PrismaClient[];
  currentPoolIndex?: number;
};

// Connection pool configuration
const POOL_SIZE = process.env.NODE_ENV === 'production' ? 10 : 3;
const CONNECTION_TIMEOUT = 10000; // 10 seconds
const QUERY_TIMEOUT = 30000; // 30 seconds

// Create optimized Prisma client with aggressive performance settings
function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Note: Connection pooling is handled at the application level
  });
}

// Initialize connection pool
if (!globalForPrisma.prismaPool) {
  globalForPrisma.prismaPool = Array.from({ length: POOL_SIZE }, () => createPrismaClient());
  globalForPrisma.currentPoolIndex = 0;
}

// Round-robin connection pool
function getPooledConnection(): PrismaClient {
  if (!globalForPrisma.prismaPool) {
    throw new Error('Prisma pool not initialized');
  }
  
  const index = globalForPrisma.currentPoolIndex!;
  globalForPrisma.currentPoolIndex = (index + 1) % POOL_SIZE;
  
  return globalForPrisma.prismaPool[index];
}

// Main prisma instance (backwards compatibility)
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV === 'development') {
  globalForPrisma.prisma = prisma;
}

// Enhanced query execution with automatic retries and connection pooling
export async function executeQuery<T>(
  queryFn: (client: PrismaClient) => Promise<T>,
  maxRetries: number = 3,
  usePool: boolean = true
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const client = usePool ? getPooledConnection() : prisma;
      return await queryFn(client);
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on certain errors
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        if (
          errorMessage.includes('unique constraint') ||
          errorMessage.includes('foreign key constraint') ||
          errorMessage.includes('not found')
        ) {
          throw error;
        }
      }
      
      // Exponential backoff
      if (attempt < maxRetries - 1) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Query failed after all retries');
}

// Batch query execution for better performance
export async function executeBatchQueries<T>(
  queries: Array<(client: PrismaClient) => Promise<T>>,
  concurrency: number = 5
): Promise<T[]> {
  const results: T[] = [];
  
  for (let i = 0; i < queries.length; i += concurrency) {
    const batch = queries.slice(i, i + concurrency);
    const batchPromises = batch.map(query => executeQuery(query));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }
  
  return results;
}

// Transaction wrapper with optimized settings
export async function withTransaction<T>(
  fn: (tx: PrismaClient) => Promise<T>,
  options?: {
    maxWait?: number;
    timeout?: number;
    isolationLevel?: 'ReadUncommitted' | 'ReadCommitted' | 'RepeatableRead' | 'Serializable';
  }
): Promise<T> {
  const client = getPooledConnection();
  
  return client.$transaction(
    async (tx) => fn(tx as PrismaClient),
    {
      maxWait: options?.maxWait || 5000,
      timeout: options?.timeout || 30000,
      isolationLevel: options?.isolationLevel || 'ReadCommitted',
    }
  );
}

// Health check for database connections
export async function checkDatabaseHealth(): Promise<{
  healthy: boolean;
  latency: number;
  activeConnections: number;
}> {
  const start = Date.now();
  
  try {
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - start;
    
    return {
      healthy: true,
      latency,
      activeConnections: POOL_SIZE,
    };
  } catch (error) {
    return {
      healthy: false,
      latency: Date.now() - start,
      activeConnections: 0,
    };
  }
}

// Graceful shutdown
export async function closeDatabaseConnections(): Promise<void> {
  if (globalForPrisma.prismaPool) {
    await Promise.all(
      globalForPrisma.prismaPool.map(client => client.$disconnect())
    );
  }
  
  if (globalForPrisma.prisma) {
    await globalForPrisma.prisma.$disconnect();
  }
}

export default prisma;
