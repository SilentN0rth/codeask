'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export function usePagination<T>(items: T[], perPage = 18, hash = '') {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(items.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedItems = items.slice(startIndex, startIndex + perPage);

  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const setPage = (page: number) => {
    setIsLoading(true);
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    // jeśli strona to /users/[slug] to zachowaj hash #activity-section. W przeciwnym razie usuń hash
    router.push(`?${params.toString()}${hash}`);
  };

  useEffect(() => {
    if (isLoading) {
      // Daj loaderowi czas na wyświetlenie (300ms)
      timerRef.current = setTimeout(() => setIsLoading(false), 300);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [currentPage, isLoading]);

  useEffect(() => {
    setIsLoading(false);
  }, [items.length]);

  return {
    paginatedItems,
    currentPage,
    totalPages,
    setPage,
    isLoading,
  };
}
