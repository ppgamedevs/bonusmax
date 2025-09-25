// Advanced multi-layer cache with TTL, LRU eviction, and compression
import { gzipSync, gunzipSync } from 'zlib';

type CacheEntry<T> = {
  data: T | Buffer; // Can store compressed data
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  compressed: boolean;
  size: number;
};

type CacheStats = {
  hits: number;
  misses: number;
  evictions: number;
  totalSize: number;
  entryCount: number;
};

class AdvancedCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize: number;
  private maxEntries: number;
  private currentSize: number = 0;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    totalSize: 0,
    entryCount: 0,
  };

  constructor(maxSizeMB: number = 100, maxEntries: number = 10000) {
    this.maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes
    this.maxEntries = maxEntries;
  }

  private shouldCompress(data: any): boolean {
    const serialized = JSON.stringify(data);
    return serialized.length > 1024; // Compress if larger than 1KB
  }

  private serialize(data: any): { serialized: string | Buffer; compressed: boolean; size: number } {
    const serialized = JSON.stringify(data);
    const shouldCompress = this.shouldCompress(data);
    
    if (shouldCompress) {
      const compressed = gzipSync(serialized);
      return {
        serialized: compressed,
        compressed: true,
        size: compressed.length,
      };
    }
    
    return {
      serialized,
      compressed: false,
      size: serialized.length,
    };
  }

  private deserialize<T>(entry: CacheEntry<T>): T {
    if (entry.compressed) {
      const decompressed = gunzipSync(entry.data as Buffer).toString();
      return JSON.parse(decompressed);
    }
    return entry.data as T;
  }

  private evictLRU(): void {
    if (this.cache.size === 0) return;

    // Find least recently used entry
    let lruKey: string | null = null;
    let lruTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < lruTime) {
        lruTime = entry.lastAccessed;
        lruKey = key;
      }
    }

    if (lruKey) {
      const entry = this.cache.get(lruKey)!;
      this.currentSize -= entry.size;
      this.cache.delete(lruKey);
      this.stats.evictions++;
    }
  }

  private enforceConstraints(): void {
    // Evict entries if we exceed size or count limits
    while (this.currentSize > this.maxSize || this.cache.size > this.maxEntries) {
      this.evictLRU();
    }
  }

  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    const { serialized, compressed, size } = this.serialize(data);
    const now = Date.now();

    // Remove existing entry if it exists
    const existing = this.cache.get(key);
    if (existing) {
      this.currentSize -= existing.size;
    }

    const entry: CacheEntry<T> = {
      data: serialized as T,
      timestamp: now,
      ttl: ttlSeconds * 1000,
      accessCount: 0,
      lastAccessed: now,
      compressed,
      size,
    };

    this.cache.set(key, entry);
    this.currentSize += size;
    this.stats.entryCount = this.cache.size;
    this.stats.totalSize = this.currentSize;

    this.enforceConstraints();
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.currentSize -= entry.size;
      this.cache.delete(key);
      this.stats.misses++;
      this.stats.entryCount = this.cache.size;
      this.stats.totalSize = this.currentSize;
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = now;
    this.stats.hits++;

    return this.deserialize(entry);
  }

  clear(): void {
    this.cache.clear();
    this.currentSize = 0;
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      totalSize: 0,
      entryCount: 0,
    };
  }

  // Clean expired entries periodically
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      const entry = this.cache.get(key)!;
      this.currentSize -= entry.size;
      this.cache.delete(key);
    }

    this.stats.entryCount = this.cache.size;
    this.stats.totalSize = this.currentSize;
  }

  getStats(): CacheStats & { hitRate: number } {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? this.stats.hits / total : 0;
    return { ...this.stats, hitRate };
  }

  // Warm up cache with frequently accessed data
  warmup<T>(entries: Array<{ key: string; data: T; ttl?: number }>): void {
    for (const entry of entries) {
      this.set(entry.key, entry.data, entry.ttl || 300);
    }
  }
}

export const cache = new AdvancedCache(50, 5000); // 50MB, 5000 entries max

// Cleanup expired entries every 2 minutes (more aggressive)
if (typeof setInterval !== 'undefined') {
  setInterval(() => cache.cleanup(), 2 * 60 * 1000);
}

// Multi-layer cache wrapper with stale-while-revalidate pattern
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttlSeconds: number = 300,
  staleWhileRevalidate: boolean = true
): Promise<T> {
  const cached = cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Check for stale data that we can return while revalidating
  if (staleWhileRevalidate) {
    const staleKey = `stale:${key}`;
    const staleData = cache.get<T>(staleKey);
    
    if (staleData !== null) {
      // Return stale data immediately and revalidate in background
      setImmediate(async () => {
        try {
          const fresh = await fn();
          cache.set(key, fresh, ttlSeconds);
          cache.set(staleKey, fresh, ttlSeconds * 2); // Keep stale data longer
        } catch (error) {
          console.warn(`Background revalidation failed for key ${key}:`, error);
        }
      });
      return staleData;
    }
  }

  const result = await fn();
  cache.set(key, result, ttlSeconds);
  
  if (staleWhileRevalidate) {
    cache.set(`stale:${key}`, result, ttlSeconds * 2);
  }
  
  return result;
}

// Batch cache operations for better performance
export async function withBatchCache<T>(
  operations: Array<{
    key: string;
    fn: () => Promise<T>;
    ttl?: number;
  }>
): Promise<T[]> {
  const results: T[] = [];
  const uncachedOps: Array<{ index: number; key: string; fn: () => Promise<T>; ttl?: number }> = [];

  // Check cache for all operations
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    const cached = cache.get<T>(op.key);
    if (cached !== null) {
      results[i] = cached;
    } else {
      uncachedOps.push({ index: i, ...op });
    }
  }

  // Execute uncached operations in parallel
  if (uncachedOps.length > 0) {
    const promises = uncachedOps.map(async (op) => {
      const result = await op.fn();
      cache.set(op.key, result, op.ttl || 300);
      return { index: op.index, result };
    });

    const uncachedResults = await Promise.all(promises);
    for (const { index, result } of uncachedResults) {
      results[index] = result;
    }
  }

  return results;
}

// Export cache stats for monitoring
export function getCacheStats() {
  return cache.getStats();
}
