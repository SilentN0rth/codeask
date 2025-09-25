'use client';

import { SortSelectProps } from '@/types/searchAndFilters.types';
import { Select, SelectItem } from '@heroui/react';

const SortSelect = ({
  options,
  selectedSort,
  onSortChange,
  className,
}: SortSelectProps) => {
  return (
    <Select
      size="sm"
      radius="sm"
      className={`h-full ${className ?? ''}`}
      label="Sortuj według"
      selectedKeys={selectedSort ? new Set([selectedSort]) : new Set()}
      onSelectionChange={(keys) => {
        const [key] = Array.from(keys);
        if (typeof key === 'string') {
          if (key === selectedSort) {
            onSortChange('' as never);
          } else {
            onSortChange(key);
          }
        } else if (Array.from(keys).length === 0) {
          onSortChange('' as never);
        }
      }}
      classNames={{
        mainWrapper: 'h-full',
        trigger:
          'h-full border border-divider bg-cBgDark-800 shadow-none hover:!bg-cBgDark-900',
      }}
    >
      {options.map((option) => (
        <SelectItem key={option.value}>{option.label}</SelectItem>
      ))}
    </Select>
  );
};

export default SortSelect;
