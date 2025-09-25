'use client';

import {
  BasicItem,
  UniversalFilterProps,
} from '@/types/searchAndFilters.types';
import { Autocomplete, AutocompleteItem } from '@heroui/react';
import React from 'react';

function UniversalFilter<T extends BasicItem>({
  items,
  value,
  className,
  onChange,
  ariaLabel,
  renderItem,
  isLoading,
}: UniversalFilterProps<T>) {
  if (isLoading) {
    return (
      <Autocomplete
        aria-label={ariaLabel}
        defaultItems={[]}
        selectedKey=""
        onSelectionChange={() => {}}
        className={`size-full ${className}`}
        variant="bordered"
        radius="md"
        isLoading
        inputProps={{
          classNames: {
            base: 'h-full',
            inputWrapper:
              ' h-full border border-divider bg-cBgDark-800 shadow-none hover:!bg-cBgDark-900',
            input: 'text-base ',
          },
        }}
        popoverProps={{
          offset: 10,
          classNames: {
            base: '',
            content: '  p-1 border border-divider bg-cBgDark-800 shadow-none ',
          },
        }}
        placeholder="Ładowanie..."
      >
        {() => null}
      </Autocomplete>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div
        className={`size-full ${className} flex items-center justify-center rounded-md border border-divider bg-cBgDark-800 shadow-none`}
      >
        <span className="text-sm text-default-500">Brak danych</span>
      </div>
    );
  }

  return (
    <Autocomplete
      aria-label={ariaLabel}
      defaultItems={items}
      selectedKey={value}
      onSelectionChange={(key) => {
        if (key !== null) onChange(String(key));
      }}
      className={`size-full ${className}`}
      variant="bordered"
      radius="md"
      inputProps={{
        classNames: {
          base: 'h-full',
          inputWrapper:
            ' h-full !border-divider !border !bg-cBgDark-800 hover:!bg-cBgDark-900',
          input: 'text-base ',
        },
      }}
      popoverProps={{
        offset: 10,
        classNames: {
          base: '',
          content: '  p-1 border border-divider bg-cBgDark-800 ',
        },
      }}
      placeholder={ariaLabel}
    >
      {(item) => (
        <AutocompleteItem key={item.id} textValue={item.username ?? item.name}>
          {renderItem ? renderItem(item) : (item.username ?? item.name)}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}

export default UniversalFilter;
