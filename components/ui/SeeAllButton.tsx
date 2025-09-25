import { Button } from '@heroui/react';
import Link from 'next/link';
import { SvgIcon } from '@/lib/utils/icons';

interface SeeAllButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const SeeAllButton = ({
  href,
  children,
  className = '',
}: SeeAllButtonProps) => {
  return (
    <Button
      as={Link}
      href={href}
      variant="light"
      size="sm"
      className={`${className} text-cCta-500 hover:bg-cCta-500/10`}
    >
      {children}
      <SvgIcon icon="solar:arrow-right-linear" width={16} />
    </Button>
  );
};

export default SeeAllButton;
