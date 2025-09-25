'use client';

import { Button } from '@heroui/react';
import { SvgIcon } from '@/lib/utils/icons';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface ClearFiltersButtonProps {
  className?: string;
  variant?: 'light' | 'flat' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  onReset?: () => void;
}

const ClearFiltersButton = ({
  className = '',
  variant = 'light',
  size = 'md',
  onReset,
}: ClearFiltersButtonProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hasActiveFilters = () => {
    const params = Array.from(searchParams.entries());
    return params.some(([, value]) => value && value.trim() !== '');
  };

  const handleClearFilters = () => {
    if (onReset) {
      onReset();
    }

    router.push(pathname, { scroll: false });
  };

  if (!hasActiveFilters()) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      radius="sm"
      className={`gap-2 border border-divider bg-cBgDark-800 text-cTextDark-100 transition-colors hover:!bg-cBgDark-700 ${className}`}
      onPress={handleClearFilters}
      startContent={<SvgIcon icon="mdi:filter-remove" className="size-4" />}
    >
      Wyczyść filtry
    </Button>
  );
};

export default ClearFiltersButton;
