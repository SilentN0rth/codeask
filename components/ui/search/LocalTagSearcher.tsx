'use client';

import { Button, Input } from '@heroui/react';

import { useSidebarContext } from 'context/LeftSidebarContext';
import { ClassName } from '@/types/index.types';
import SortSelect from '../filters/SortSelect';
import { useLocalSearch } from 'hooks/useLocalSearch';
import { SortTagOption } from '@/types/searchAndFilters.types';
import { SORT_TAG_OPTIONS } from '@/constants/SearchAndFilters';
import { SvgIcon } from '@/lib/utils/icons';
import { forwardRef, useImperativeHandle } from 'react';

const LocalTagSearcher = forwardRef<{ resetAllFilters: () => void }, ClassName>(
  ({ className }, ref) => {
    const { isCompact } = useSidebarContext();

    const {
      searchInput,
      handleSearchChange,
      sortBy,
      handleSortChange,
      resetAllFilters,
    } = useLocalSearch<SortTagOption>({
      initialSearch: true,
      initialSort: true,
    });

    useImperativeHandle(ref, () => ({
      resetAllFilters,
    }));

    return (
      <div
        className={`mb-4 mt-6 grid grid-cols-12 place-content-end gap-2 ${className}`}
      >
        <Input
          aria-label="Search"
          value={searchInput}
          onValueChange={handleSearchChange}
          radius="sm"
          classNames={{
            base: `col-span-12 text-base flex h-full gap-2 ${isCompact ? 'sm:col-span-8 md:col-span-full lg:col-span-4 xl:col-span-6' : 'lg:col-span-8 xl:col-span-full 2xl:col-span-3'}`,
            input: 'text-base',
            inputWrapper:
              'h-full border border-divider bg-cBgDark-800 shadow-none hover:!bg-cBgDark-900 h-14',
          }}
          placeholder="Szukaj..."
          endContent={
            <Button
              variant="light"
              radius="sm"
              className="-mr-1.5 !min-w-fit text-cTextDark-100 hover:!bg-cBgDark-700"
              aria-label="Szukaj tagów"
            >
              <SvgIcon icon="mdi:magnify" className="size-5" />
            </Button>
          }
        />
        <SortSelect
          options={SORT_TAG_OPTIONS}
          className={`col-span-full ${isCompact ? 'sm:col-span-4 md:col-span-4 lg:col-span-3 xl:col-span-2' : 'lg:col-span-4 2xl:col-span-3'}`}
          selectedSort={sortBy}
          onSortChange={(val) => handleSortChange(val as SortTagOption)}
        />
      </div>
    );
  }
);

LocalTagSearcher.displayName = 'LocalTagSearcher';

export default LocalTagSearcher;
