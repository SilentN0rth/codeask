'use client';

import { FILTER_OPTIONS } from '@/constants/SearchAndFilters';
import { ChooseButtonFilterProps } from '@/types/searchAndFilters.types';
import { Select, SelectItem } from '@heroui/react';

const ChooseButtonFilter = ({
  className,
  selectedFilter,
  onFilterChange,
  filterOptions = FILTER_OPTIONS,
}: ChooseButtonFilterProps) => {
  return (
    <Select
      size="sm"
      radius="sm"
      className={`h-full ${className}`}
      label="Wybierz filtr"
      selectedKeys={[selectedFilter]}
      onChange={(e) => onFilterChange(e.target.value)}
      classNames={{
        mainWrapper: 'h-full',
        trigger:
          'h-full border border-divider bg-cBgDark-800 shadow-none hover:!bg-cBgDark-900',
      }}
    >
      {filterOptions.map((option) => (
        <SelectItem key={option.value}>{option.label}</SelectItem>
      ))}
    </Select>
  );
};

export default ChooseButtonFilter;
