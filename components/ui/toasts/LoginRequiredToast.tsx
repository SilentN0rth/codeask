'use client';

import { addToast } from '@heroui/react';
import { SvgIcon } from '@/lib/utils/icons';

interface LoginRequiredToastProps {
  action: string;
}

export const showLoginRequiredToast = ({ action }: LoginRequiredToastProps) => {
  addToast({
    title: 'Wymagane logowanie',
    description: `Aby ${action}, musisz być zalogowany.`,
    icon: <SvgIcon icon="solar:lock-linear" />,
    color: 'warning',
  });
};

export default showLoginRequiredToast;
