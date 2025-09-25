'use client';

import { useEffect, useState } from 'react';
// Note: Cache stats temporarily disabled for build compatibility
// import { getCacheStats } from '@bonusmax/lib/cache';

interface PerformanceMetrics {
  cacheStats: {
    hits: number;
    misses: number;
    hitRate: number;
    totalSize: number;
    entryCount: number;
  };
  webVitals: {
    lcp?: number;
    fid?: number;
    cls?: number;
    fcp?: number;
    ttfb?: number;
  };
  memoryUsage?: {
    used: number;
    total: number;
  };
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cacheStats: {
      hits: 0,
      misses: 0,
      hitRate: 0,
      totalSize: 0,
      entryCount: 0,
    },
    webVitals: {},
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    const updateMetrics = () => {
      // Temporary mock cache stats for build compatibility
      const cacheStats = {
        hits: 0,
        misses: 0,
        hitRate: 0,
        totalSize: 0,
        entryCount: 0,
      };
      
      let memoryUsage: { used: number; total: number } | undefined;
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        memoryUsage = {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        };
      }

      setMetrics(prev => ({
        ...prev,
        cacheStats,
        memoryUsage,
      }));
    };

    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000);
    updateMetrics(); // Initial update

    // Listen for Web Vitals (simplified implementation)
    if (typeof window !== 'undefined') {
      import('web-vitals').then((webVitals) => {
        // Use the available functions from web-vitals v5
        const vitalsModule = webVitals as any;
        
        if (vitalsModule.onCLS) {
          vitalsModule.onCLS((metric: any) => {
            setMetrics(prev => ({
              ...prev,
              webVitals: { ...prev.webVitals, cls: metric.value },
            }));
          });
        }

        if (vitalsModule.onINP) {
          vitalsModule.onINP((metric: any) => {
            setMetrics(prev => ({
              ...prev,
              webVitals: { ...prev.webVitals, fid: metric.value },
            }));
          });
        }

        if (vitalsModule.onFCP) {
          vitalsModule.onFCP((metric: any) => {
            setMetrics(prev => ({
              ...prev,
              webVitals: { ...prev.webVitals, fcp: metric.value },
            }));
          });
        }

        if (vitalsModule.onLCP) {
          vitalsModule.onLCP((metric: any) => {
            setMetrics(prev => ({
              ...prev,
              webVitals: { ...prev.webVitals, lcp: metric.value },
            }));
          });
        }

        if (vitalsModule.onTTFB) {
          vitalsModule.onTTFB((metric: any) => {
            setMetrics(prev => ({
              ...prev,
              webVitals: { ...prev.webVitals, ttfb: metric.value },
            }));
          });
        }
      }).catch(() => {
        // web-vitals not available, continue without it
        console.log('Web Vitals not available');
      });
    }

    return () => clearInterval(interval);
  }, []);

  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Performance Monitor"
      >
        📊
      </button>

      {/* Performance panel */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-xl p-4 max-w-sm">
          <h3 className="font-bold text-lg mb-3">Performance Monitor</h3>
          
          {/* Cache Stats */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-2">Cache Performance</h4>
            <div className="text-xs space-y-1">
              <div>Hit Rate: {(metrics.cacheStats.hitRate * 100).toFixed(1)}%</div>
              <div>Entries: {metrics.cacheStats.entryCount}</div>
              <div>Size: {(metrics.cacheStats.totalSize / 1024 / 1024).toFixed(2)} MB</div>
              <div>Hits: {metrics.cacheStats.hits} | Misses: {metrics.cacheStats.misses}</div>
            </div>
          </div>

          {/* Web Vitals */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-2">Web Vitals</h4>
            <div className="text-xs space-y-1">
              {metrics.webVitals.lcp && (
                <div className={`${metrics.webVitals.lcp > 2500 ? 'text-red-600' : metrics.webVitals.lcp > 1200 ? 'text-yellow-600' : 'text-green-600'}`}>
                  LCP: {metrics.webVitals.lcp.toFixed(0)}ms
                </div>
              )}
              {metrics.webVitals.fid && (
                <div className={`${metrics.webVitals.fid > 300 ? 'text-red-600' : metrics.webVitals.fid > 100 ? 'text-yellow-600' : 'text-green-600'}`}>
                  FID: {metrics.webVitals.fid.toFixed(0)}ms
                </div>
              )}
              {metrics.webVitals.cls && (
                <div className={`${metrics.webVitals.cls > 0.25 ? 'text-red-600' : metrics.webVitals.cls > 0.1 ? 'text-yellow-600' : 'text-green-600'}`}>
                  CLS: {metrics.webVitals.cls.toFixed(3)}
                </div>
              )}
              {metrics.webVitals.fcp && (
                <div>FCP: {metrics.webVitals.fcp.toFixed(0)}ms</div>
              )}
              {metrics.webVitals.ttfb && (
                <div>TTFB: {metrics.webVitals.ttfb.toFixed(0)}ms</div>
              )}
            </div>
          </div>

          {/* Memory Usage */}
          {metrics.memoryUsage && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Memory Usage</h4>
              <div className="text-xs">
                {metrics.memoryUsage.used} MB / {metrics.memoryUsage.total} MB
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(metrics.memoryUsage.used / metrics.memoryUsage.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
