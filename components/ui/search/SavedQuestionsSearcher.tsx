'use client';

import { Button, Input } from '@heroui/react';
import { useSidebarContext } from 'context/LeftSidebarContext';
import { ClassName } from '@/types/index.types';
import { SortQuestionOption } from '@/types/searchAndFilters.types';
import SortSelect from '../filters/SortSelect';
import ChooseButtonFilter from '../filters/ChooseButtonFilter';
import TagsFilter from '../filters/TagsFilter';
import {
  SORT_QUESTION_OPTIONS,
  SAVED_QUESTIONS_FILTER_OPTIONS,
} from '@/constants/SearchAndFilters';
import { useLocalSearch } from 'hooks/useLocalSearch';
import { SvgIcon } from '@/lib/utils/icons';
import { forwardRef, useImperativeHandle } from 'react';

const SavedQuestionsSearcher = forwardRef<
  { resetAllFilters: () => void },
  ClassName
>(({ className }, ref) => {
  const { isCompact } = useSidebarContext();

  const {
    searchInput,
    handleSearchChange,
    sortBy,
    handleSortChange,
    customValues,
    updateCustomValue,
    resetAllFilters,
  } = useLocalSearch<SortQuestionOption>({
    initialSearch: true,
    initialSort: true,
    customParams: ['filter', 'value'],
  });

  useImperativeHandle(ref, () => ({
    resetAllFilters,
  }));

  const selectedFilter = customValues.filter;
  const filterValue = customValues.value;

  const handleFilterChange = (newFilter: string) => {
    if (newFilter !== selectedFilter) {
      updateCustomValue('value', '');
    }
    updateCustomValue('filter', newFilter);
  };

  const renderFilterComponent = () => {
    const commonProps = {
      value: filterValue,
      onChange: (val: string) => updateCustomValue('value', val),
      className: `col-span-7 ${
        isCompact
          ? 'sm:col-span-8 md:col-span-4 lg:col-span-3 xl:col-span-2'
          : 'lg:col-span-8 xl:col-span-4 2xl:col-span-3'
      }`,
    };

    switch (selectedFilter) {
      case 'tags':
        return <TagsFilter {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`mt-6 grid grid-cols-12 place-content-end gap-2 ${className}`}
    >
      <Input
        aria-label="Search"
        value={searchInput}
        onValueChange={handleSearchChange}
        radius="sm"
        classNames={{
          base: `col-span-12 flex h-full gap-2 ${isCompact ? 'sm:col-span-8 md:col-span-full lg:col-span-4 xl:col-span-6' : 'lg:col-span-8 xl:col-span-full 2xl:col-span-3'}`,
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
          >
            <SvgIcon icon="mdi:magnify" className="size-5" />
          </Button>
        }
      />
      <SortSelect
        options={SORT_QUESTION_OPTIONS}
        className={`col-span-full ${isCompact ? 'sm:col-span-4 md:col-span-4 lg:col-span-3 xl:col-span-2' : 'lg:col-span-4 2xl:col-span-3'}`}
        selectedSort={sortBy}
        onSortChange={(val) => handleSortChange(val as SortQuestionOption)}
      />
      <ChooseButtonFilter
        className={`col-span-5 ${isCompact ? 'sm:col-span-4 md:col-span-4 lg:col-span-2 xl:col-span-2' : 'lg:col-span-4 2xl:col-span-3'}`}
        selectedFilter={selectedFilter}
        onFilterChange={(val) => handleFilterChange(val)}
        filterOptions={SAVED_QUESTIONS_FILTER_OPTIONS}
      />
      {renderFilterComponent()}
    </div>
  );
});

SavedQuestionsSearcher.displayName = 'SavedQuestionsSearcher';

export default SavedQuestionsSearcher;
