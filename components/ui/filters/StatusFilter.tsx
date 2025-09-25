'use client';

import { Select, SelectItem } from '@heroui/react';
import { ClassName } from '@/types/index.types';

interface StatusFilterProps extends ClassName {
  value: string;
  onChange: (value: string) => void;
}

const STATUS_OPTIONS = [
  { label: 'Wszystkie', value: '' },
  { label: 'Otwarte', value: 'opened' },
  { label: 'Zamknięte', value: 'closed' },
  { label: 'Zarchiwizowane', value: 'archived' },
];

const StatusFilter = ({ className, value, onChange }: StatusFilterProps) => {
  return (
    <Select
      size="sm"
      radius="sm"
      className={`h-full ${className}`}
      label="Status pytań"
      selectedKeys={[value]}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        onChange(e.target.value)
      }
      classNames={{
        mainWrapper: 'h-full',
        trigger:
          'h-full border border-divider bg-cBgDark-800 shadow-none hover:!bg-cBgDark-900',
      }}
    >
      {STATUS_OPTIONS.map((option) => (
        <SelectItem key={option.value}>{option.label}</SelectItem>
      ))}
    </Select>
  );
};

export default StatusFilter;
