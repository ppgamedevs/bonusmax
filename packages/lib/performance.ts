// Advanced React performance optimization utilities
import React, { memo, useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { cache } from './cache';

// Aggressive memoization wrapper
export function deepMemo<T extends React.ComponentType<any>>(
  Component: T,
  areEqual?: (prevProps: React.ComponentProps<T>, nextProps: React.ComponentProps<T>) => boolean
): T {
  return memo(Component, areEqual || ((prev: React.ComponentProps<T>, next: React.ComponentProps<T>) => {
    // Deep comparison for complex props
    return JSON.stringify(prev) === JSON.stringify(next);
  })) as T;
}

// Optimized useCallback with dependency tracking
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList,
  cacheKey?: string
): T {
  const memoizedCallback = useCallback(callback, deps);
  
  // Cache the callback if a key is provided
  if (cacheKey) {
    const cached = cache.get<T>(cacheKey);
    if (cached) return cached;
    
    cache.set(cacheKey, memoizedCallback, 300);
  }
  
  return memoizedCallback;
}

// Optimized useMemo with automatic dependency detection
export function useOptimizedMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  cacheKey?: string
): T {
  const memoizedValue = useMemo(factory, deps);
  
  // Cache the computed value if a key is provided
  if (cacheKey) {
    const cached = cache.get<T>(cacheKey);
    if (cached) return cached;
    
    cache.set(cacheKey, memoizedValue, 300);
  }
  
  return memoizedValue;
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [React.RefObject<HTMLElement>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options]);

  return [ref, isIntersecting];
}

// Debounced state hook for performance
export function useDebouncedState<T>(
  initialValue: T,
  delay: number = 300
): [T, T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [value, debouncedValue, setValue];
}

// Virtual scrolling hook for large lists
export function useVirtualScrolling<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
): {
  visibleItems: T[];
  startIndex: number;
  endIndex: number;
  totalHeight: number;
  offsetY: number;
} {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length - 1
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    startIndex,
    endIndex,
    totalHeight,
    offsetY,
  };
}

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);

  useEffect(() => {
    renderStartTime.current = performance.now();
    renderCount.current += 1;
  });

  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
    }

    // Track performance metrics
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(`${componentName}-render-end`);
      performance.measure(
        `${componentName}-render`,
        `${componentName}-render-start`,
        `${componentName}-render-end`
      );
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(`${componentName}-render-start`);
    }
  }, [componentName]);
}

// Preload resources hook
export function usePreloadResources(resources: string[]) {
  useEffect(() => {
    const preloadPromises = resources.map(resource => {
      if (resource.endsWith('.js')) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'script';
        link.href = resource;
        document.head.appendChild(link);
        return Promise.resolve();
      } else if (resource.match(/\.(jpg|jpeg|png|webp|avif)$/)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = resource;
        document.head.appendChild(link);
        return Promise.resolve();
      } else {
        return fetch(resource, { method: 'HEAD' });
      }
    });

    Promise.all(preloadPromises).catch(error => {
      console.warn('Failed to preload some resources:', error);
    });
  }, [resources]);
}

// Component lazy loading with error boundary
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
): React.LazyExoticComponent<T> {
  const LazyComponent = React.lazy(importFn);
  
  return LazyComponent;
}

// HOC for automatic performance optimization
export function withPerformanceOptimization<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    memo?: boolean;
    displayName?: string;
    preloadResources?: string[];
  } = {}
): React.ComponentType<P> {
  const { memo: shouldMemo = true, displayName, preloadResources = [] } = options;

  const OptimizedComponent: React.ComponentType<P> = (props: P) => {
    usePerformanceMonitor(displayName || Component.displayName || Component.name);
    usePreloadResources(preloadResources);

    return React.createElement(Component, props);
  };

  OptimizedComponent.displayName = displayName || `Optimized(${Component.displayName || Component.name})`;

  return shouldMemo ? memo(OptimizedComponent) : OptimizedComponent;
}

// Batch state updates for better performance
export function useBatchedState<T extends Record<string, any>>(
  initialState: T
): [T, (updates: Partial<T>) => void] {
  const [state, setState] = useState<T>(initialState);
  const pendingUpdates = useRef<Partial<T>>({});
  const updateTimeout = useRef<NodeJS.Timeout | null>(null);

  const batchedSetState = useCallback((updates: Partial<T>) => {
    pendingUpdates.current = { ...pendingUpdates.current, ...updates };

    if (updateTimeout.current) {
      clearTimeout(updateTimeout.current);
    }

    updateTimeout.current = setTimeout(() => {
      setState((prevState: T) => ({ ...prevState, ...pendingUpdates.current }));
      pendingUpdates.current = {};
      updateTimeout.current = null;
    }, 16); // Batch updates within a single frame
  }, []);

  return [state, batchedSetState];
}
