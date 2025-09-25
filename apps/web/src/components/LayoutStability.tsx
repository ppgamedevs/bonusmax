'use client';

import { ReactNode } from 'react';

interface LayoutStabilityProps {
  children: ReactNode;
  width?: number | string;
  height?: number | string;
  aspectRatio?: string;
  className?: string;
  minHeight?: number | string;
}

// Component to prevent layout shift by reserving space
export default function LayoutStability({
  children,
  width,
  height,
  aspectRatio,
  className = '',
  minHeight,
}: LayoutStabilityProps) {
  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || 'auto',
    aspectRatio: aspectRatio,
    minHeight: minHeight,
    // Prevent layout shift
    contain: 'layout style',
  };

  return (
    <div className={`${className}`} style={style}>
      {children}
    </div>
  );
}

// Higher-order component to wrap components with layout stability
export function withLayoutStability<P extends object>(
  Component: React.ComponentType<P>,
  defaultProps?: Partial<LayoutStabilityProps>
) {
  const StableComponent = (props: P & Partial<LayoutStabilityProps>) => {
    const { width, height, aspectRatio, className, minHeight, ...componentProps } = props;
    
    return (
      <LayoutStability
        width={width || defaultProps?.width}
        height={height || defaultProps?.height}
        aspectRatio={aspectRatio || defaultProps?.aspectRatio}
        className={className || defaultProps?.className}
        minHeight={minHeight || defaultProps?.minHeight}
      >
        <Component {...(componentProps as P)} />
      </LayoutStability>
    );
  };

  StableComponent.displayName = `WithLayoutStability(${Component.displayName || Component.name})`;
  return StableComponent;
}

// Skeleton components to prevent layout shift during loading
export function OfferCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white rounded-lg border p-4 ${className}`}>
      <div className="flex items-start space-x-4">
        {/* Logo skeleton */}
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
        
        <div className="flex-1 min-w-0">
          {/* Title skeleton */}
          <div className="h-5 bg-gray-200 rounded mb-2" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
          
          {/* Terms skeleton */}
          <div className="h-3 bg-gray-200 rounded w-full mb-1" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
      
      {/* Button skeleton */}
      <div className="mt-4 h-10 bg-gray-200 rounded" />
    </div>
  );
}

export function OffersGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <OfferCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Title skeleton */}
            <div className="h-12 bg-white/20 rounded mb-6 mx-auto max-w-2xl" />
            <div className="h-6 bg-white/20 rounded mb-8 mx-auto max-w-xl" />
            
            {/* CTA skeleton */}
            <div className="h-12 bg-white/20 rounded mx-auto max-w-xs" />
          </div>
        </div>
      </div>
    </div>
  );
}
