'use client';

import { Skeleton } from '@heroui/react';

export const TagSkeleton = () => {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-divider bg-cBgDark-800 backdrop-blur-sm">
      <div className="relative z-10 space-y-3 p-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-cBgDark-700 shadow-lg">
            <Skeleton className="size-4 rounded" />
          </div>
          <div className="flex-1">
            <Skeleton className="mb-1 h-4 w-20 rounded-lg" />
            <Skeleton className="h-3 w-24 rounded-lg" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Skeleton className="size-4 rounded" />
            <Skeleton className="h-4 w-6 rounded-lg" />
            <Skeleton className="h-3 w-12 rounded-lg" />
          </div>
        </div>

        <div className="h-0.5 w-0 bg-cCta-500 transition-all duration-300 group-hover:w-full" />
      </div>
    </div>
  );
};
