// Simple runtime-only caching system that doesn't interfere with build
class RuntimeCache {
  private cache = new Map<string, { data: any; expires: number }>();
  private maxSize = 100; // Keep it small to avoid memory issues

  set(key: string, data: any, ttlSeconds: number = 300) {
    // Only cache in browser environment
    if (typeof window === 'undefined') return;
    
    // Clear old entries if cache is getting too large
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    const expires = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { data, expires });
  }

  get(key: string): any | null {
    // Only work in browser environment
    if (typeof window === 'undefined') return null;
    
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear() {
    this.cache.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
    };
  }
}

// Global runtime cache instance
const runtimeCache = new RuntimeCache();

// Helper function for caching API calls
export async function withRuntimeCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  // Check cache first
  const cached = runtimeCache.get(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetchFn();
  
  // Cache the result
  runtimeCache.set(key, data, ttlSeconds);
  
  return data;
}

export { runtimeCache };
