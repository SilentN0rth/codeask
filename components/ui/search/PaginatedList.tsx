'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import UniversalPagination from '../UniversalPagination';
import React, { Suspense } from 'react';
import { ClassName } from '@/types/index.types';

type PaginatedListProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  perPage?: number;
};

export default function PaginatedList<T>({
  items,
  renderItem,
  perPage = 18,
  className,
}: PaginatedListProps<T> & ClassName) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(items.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedItems = items.slice(startIndex, startIndex + perPage);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  if (items.length === 0) return null;

  return (
    <Suspense>
      <div className={className}>
        {paginatedItems.map(renderItem)}
        {totalPages > 1 && (
          <UniversalPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="col-span-full mx-auto mt-4"
            ariaLabel="Przejdź między stronami listy"
          />
        )}
      </div>
    </Suspense>
  );
}
