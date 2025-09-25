'use client';

import { Card, CardBody } from '@heroui/react';
import { motion } from 'framer-motion';
import { SvgIcon } from '@/lib/utils/icons';

interface NoResultsProps {
  title?: string;
  description?: string;
  hint?: React.ReactNode;
  icon?: string;
  iconClassName?: string;
  className?: string;
  childClassName?: string;
}

const NoResults = ({
  title = 'Brak wyników',
  description = 'Nie znaleziono elementów spełniających kryteria wyszukiwania.',
  hint = 'Spróbuj zmienić filtry lub wyszukiwane hasło.',
  icon = 'lucide:search-x',
  iconClassName = 'size-8 text-default-400',
  className = '',
  childClassName = 'max-w-md',
}: NoResultsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`flex justify-center ${className}`}
    >
      <Card
        className={`border border-divider bg-cBgDark-800 backdrop-blur-sm ${childClassName}`}
        shadow="none"
      >
        <CardBody className="flex flex-col items-center gap-4 p-5 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-cBgDark-700/50">
            <SvgIcon icon={icon} className={iconClassName} />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-default-600">{title}</p>
            <p className="text-sm text-default-400">{description}</p>
          </div>
          {hint && <div className="text-xs text-default-500">{hint}</div>}
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default NoResults;
