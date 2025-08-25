import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  className?: string;
  rows?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = React.memo(({ 
  className = "h-4 w-full", 
  rows = 1 
}) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className={className} />
      ))}
    </div>
  );
});

LoadingSkeleton.displayName = 'LoadingSkeleton';