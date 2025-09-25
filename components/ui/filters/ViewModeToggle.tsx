'use client';

import { Select, SelectItem } from '@heroui/react';
import { SvgIcon } from '@/lib/utils/icons';

export type ViewMode = 'masonry' | 'grid' | 'flex';

interface ViewModeToggleProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  className?: string;
  hasActiveFilters?: boolean;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  currentMode,
  onModeChange,
  className = '',
  hasActiveFilters = false,
}) => {
  const modes: {
    mode: ViewMode;
    icon: string;
    label: string;
    disabled?: boolean;
  }[] = [
    {
      mode: 'masonry',
      icon: 'mdi:view-grid-outline',
      label: 'Masonry',
      disabled: hasActiveFilters,
    },
    {
      mode: 'grid',
      icon: 'mdi:grid',
      label: 'Grid',
    },
    {
      mode: 'flex',
      icon: 'mdi:view-list-outline',
      label: 'Lista',
    },
  ];

  return (
    <div className={`flex items-center ${className}`}>
      <Select
        disabledKeys={
          hasActiveFilters
            ? new Set(['masonry', currentMode])
            : new Set([currentMode])
        }
        size="sm"
        radius="sm"
        className="w-auto min-w-[120px]"
        placeholder="Widok"
        selectedKeys={new Set([currentMode])}
        onSelectionChange={(keys) => {
          const [key] = Array.from(keys);
          if (typeof key === 'string' && key !== currentMode) {
            onModeChange(key as ViewMode);
          }
        }}
        classNames={{
          mainWrapper: 'w-auto',
          trigger:
            'w-auto min-w-[120px] border border-divider bg-cBgDark-800 shadow-none hover:!bg-cBgDark-900',
          value: 'text-cTextDark-100',
          selectorIcon: 'text-cTextDark-100',
        }}
        renderValue={(items) => {
          const [selectedItem] = items;
          if (!selectedItem) return null;

          const mode = modes.find((m) => m.mode === selectedItem.key);
          return (
            <div className="flex items-center gap-2">
              <SvgIcon
                icon={mode?.icon ?? 'mdi:view-grid-outline'}
                className="size-4"
              />
              <span className="text-cTextDark-100">
                {mode?.label ?? 'Widok'}
              </span>
            </div>
          );
        }}
      >
        {modes.map(({ mode, icon, label }) => (
          <SelectItem
            key={mode}
            startContent={<SvgIcon icon={icon} className="size-4" />}
          >
            {label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default ViewModeToggle;
