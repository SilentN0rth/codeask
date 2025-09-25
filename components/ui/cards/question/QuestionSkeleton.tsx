'use client';

import { Card, Skeleton } from '@heroui/react';

export const QuestionSkeleton = () => {
  return (
    <Card
      shadow="none"
      className="relative h-full justify-between overflow-hidden rounded-xl border border-divider bg-cBgDark-800 backdrop-blur-sm"
    >
      <div className="flex w-full justify-between gap-4 p-4 pb-2">
        <div className="flex items-start gap-3">
          <Skeleton className="size-10 rounded-lg" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24 rounded-lg" />
            <Skeleton className="h-3 w-32 rounded-lg" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Skeleton className="h-3 w-20 rounded-lg" />
          <Skeleton className="h-3 w-16 rounded-lg" />
          <Skeleton className="h-3 w-24 rounded-lg" />
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4 pt-0">
        <Skeleton className="h-6 w-full rounded-lg" />
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-1/2 rounded-lg" />

        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </div>

      <div className="relative overflow-visible p-4 pt-0">
        <div className="flex w-full items-center justify-between">
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton
                key={`skeleton-${i}`}
                className="h-6 w-12 rounded-full"
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="size-8 rounded-lg" />
            <Skeleton className="size-8 rounded-lg" />
          </div>
        </div>
      </div>
    </Card>
  );
};
