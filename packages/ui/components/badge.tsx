import * as React from 'react';
import cn from '../lib/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline';
}

const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900',
  secondary: 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
  outline: 'border border-gray-200 dark:border-gray-700',
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
