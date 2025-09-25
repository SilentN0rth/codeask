'use client';

import { useEffect, useState } from 'react';
import { FilterProps } from '@/types/searchAndFilters.types';
import UniversalFilter from './UniversalLocalFilter';
import { getTags } from '@/services/client/tags';
import { Tag } from '@/types/tags.types';

const TagsFilter = ({ className, value, onChange }: FilterProps) => {
  const [tagItems, setTagItems] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { tags } = await getTags();
        setTagItems(tags);
      } catch {
        setError('Błąd ładowania tagów');
        setTagItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchTags();
  }, []);

  if (error) {
    return (
      <div className={`${className} flex h-full items-center justify-center`}>
        <div className="text-sm text-danger-500">{error}</div>
      </div>
    );
  }

  return (
    <UniversalFilter
      value={value}
      className={className}
      onChange={onChange}
      items={tagItems}
      ariaLabel="Tag"
      isLoading={isLoading}
    />
  );
};

export default TagsFilter;
