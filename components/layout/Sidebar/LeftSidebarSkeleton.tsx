import { Skeleton, Listbox, ListboxSection, ListboxItem } from '@heroui/react';
import React from 'react';

const LeftSidebarSkeleton = () => {
  return (
    <Listbox hideSelectedIcon as="ul" variant="flat" className="gap-1">
      <ListboxSection
        as="li"
        role="listitem"
        title="Przeglądaj"
        showDivider={false}
      >
        <ListboxItem key="skeleton-1">
          <div className="flex items-center gap-3">
            <Skeleton className="size-6 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        </ListboxItem>
        <ListboxItem key="skeleton-2">
          <div className="flex items-center gap-3">
            <Skeleton className="size-6 rounded" />
            <Skeleton className="h-4 w-32 rounded" />
          </div>
        </ListboxItem>
        <ListboxItem key="skeleton-3">
          <div className="flex items-center gap-3">
            <Skeleton className="size-6 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
        </ListboxItem>
        <ListboxItem key="skeleton-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-6 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
        </ListboxItem>
      </ListboxSection>

      <ListboxSection
        as="li"
        role="listitem"
        title="Moje centrum"
        showDivider={false}
      >
        <ListboxItem key="skeleton-5">
          <div className="flex items-center gap-3">
            <Skeleton className="size-6 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
        </ListboxItem>
        <ListboxItem key="skeleton-6">
          <div className="flex items-center gap-3">
            <Skeleton className="size-6 rounded" />
            <Skeleton className="h-4 w-28 rounded" />
          </div>
        </ListboxItem>
        <ListboxItem key="skeleton-7">
          <div className="flex items-center gap-3">
            <Skeleton className="size-6 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
        </ListboxItem>
      </ListboxSection>

      <ListboxSection
        as="li"
        role="listitem"
        title="Najaktywniejsi"
        showDivider={false}
        className="hidden sm:flex"
      >
        <ListboxItem key="skeleton-8">
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          </div>
        </ListboxItem>
        <ListboxItem key="skeleton-9">
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          </div>
        </ListboxItem>
      </ListboxSection>
    </Listbox>
  );
};

export default LeftSidebarSkeleton;
