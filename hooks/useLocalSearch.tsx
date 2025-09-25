'use client';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ParamsLocalSearcherConfig } from '@/types/searchers.types';

export const useLocalSearch = <TSort extends string = string>(
  config: ParamsLocalSearcherConfig
) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchInput, setSearchInput] = useState(() =>
    config.initialSearch ? searchParams.get('search') || '' : ''
  );
  const [search, setSearch] = useState(searchInput);

  const [sortBy, setSortBy] = useState<TSort | ''>(() =>
    config.initialSort ? (searchParams.get('sort') as TSort) || '' : ''
  );

  const [customValues, setCustomValues] = useState<Record<string, string>>(
    () => {
      const values: Record<string, string> = {};
      config.customParams?.forEach((param) => {
        values[param] = searchParams.get(param) || '';
      });
      return values;
    }
  );

  const [hasInteracted, setHasInteracted] = useState(false);
  const debounceTimeout = useRef<number | null>(null);

  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    if (!hasInteracted) setHasInteracted(true);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = window.setTimeout(() => {
      setSearch(val);
    }, 400);
  };

  const updateCustomValue = (key: string, val: string) => {
    setCustomValues((prev) => ({ ...prev, [key]: val }));
    if (!hasInteracted) setHasInteracted(true);
  };

  const handleSortChange = (val: TSort) => {
    setSortBy(val);
    if (!hasInteracted) setHasInteracted(true);
  };

  const resetAllFilters = () => {
    setSearchInput('');
    setSearch('');
    setSortBy('');
    setCustomValues({});
    setHasInteracted(false);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (!hasInteracted) return;

    const params = new URLSearchParams();

    if (search) params.set('search', search);
    if (sortBy) params.set('sort', sortBy as string);

    Object.entries(customValues).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [search, sortBy, customValues, hasInteracted, router]);

  return {
    searchInput,
    setSearchInput,
    handleSearchChange,
    search,
    sortBy,
    handleSortChange,
    customValues,
    updateCustomValue,
    resetAllFilters,
  };
};
