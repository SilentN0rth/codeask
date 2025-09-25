'use client';

import { Pagination, Button } from '@heroui/react';
import { motion } from 'framer-motion';

interface UniversalPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  classNames?: {
    base?: string;
    item?: string;
    cursor?: string;
    prev?: string;
    next?: string;
  };
  animation?: Record<string, unknown>;
  ariaLabel?: string;
}

export default function UniversalPagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  classNames = {
    base: 'place-self-center',
    item: 'bg-cBgDark-700',
    cursor: 'rounded-sm bg-cCta-500',
    prev: 'bg-cBgDark-700',
    next: 'bg-cBgDark-700',
  },
  animation,
  ariaLabel = 'Przejdź między stronami',
}: UniversalPaginationProps) {
  if (totalPages <= 1) return null;

  const paginationComponent = (
    <Pagination
      as={animation ? motion.div : undefined}
      {...(animation ?? {})}
      classNames={classNames}
      className={className}
      isCompact
      showControls
      page={currentPage}
      total={totalPages}
      onChange={onPageChange}
      aria-label={ariaLabel}
      renderItem={(props) => (
        <li role="listitem" key={props.key} className={props.className}>
          <Button
            {...props}
            aria-label={`Przejdź do strony ${
              props.value === 'prev'
                ? 'poprzedniej'
                : props.value === 'next'
                  ? 'następnej'
                  : props.value
            }`}
            key={null}
            value={props.value.toString()}
            style={{
              padding: '0',
            }}
          />
        </li>
      )}
    />
  );

  return paginationComponent;
}
