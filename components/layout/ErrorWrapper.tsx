'use client';

import React from 'react';
import { Button } from '@heroui/react';
import Link from 'next/link';
import { ErrorWrapperProps } from '@/types/index.types';
import { SvgIcon } from '@/lib/utils/icons';

const ErrorWrapper = ({
  title = 'Coś poszło nie tak',
  description = 'Spróbuj ponownie później lub wróć na stronę główną.',
  icon = 'solar:danger-triangle-bold',
  children,
}: ErrorWrapperProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <SvgIcon icon={icon} className="size-12 text-red-500" />
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="max-w-md text-default-500">{description}</p>
      {children}
      <Button as={Link} radius="sm" href="/" className="mt-2">
        Wróć na stronę główną
      </Button>
    </div>
  );
};

export default ErrorWrapper;
