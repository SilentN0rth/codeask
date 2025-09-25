'use client';

import { motion } from 'framer-motion';
import { useFadeIn } from '@/lib/animations/useFadeIn';
import { getRelativeTimeFromNow } from '@/lib/utils/getRelativeTimeFromNow';
import { UserInterface } from '@/types/users.types';
import { SvgIcon } from '@/lib/utils/icons';
import UserDisplay from '../../UserDisplay';

interface QuestionCardHeaderProps {
  author?: UserInterface;
  status: 'opened' | 'closed' | 'archived';
  created_at: string;
  updated_at?: string;
}

export const QuestionCardHeader: React.FC<QuestionCardHeaderProps> = ({
  author,
  created_at,
  status,
  updated_at,
}) => {
  const fadeIn = useFadeIn(0, 0.3);

  const activityTime = updated_at
    ? getRelativeTimeFromNow(updated_at)
    : undefined;

  const localTime = getRelativeTimeFromNow(created_at);

  return (
    <div className="flex w-full flex-col p-4 pb-2">
      <div className="mb-1 flex justify-end text-xs text-default-400">
        {localTime && !activityTime && (
          <motion.p className="" {...fadeIn} transition={{ delay: 0.2 }}>
            Utworzono: {localTime}
          </motion.p>
        )}
        {activityTime && (
          <motion.p {...fadeIn} transition={{ delay: 0.2 }}>
            Aktywność: {activityTime}
          </motion.p>
        )}
      </div>
      <div className="flex justify-between gap-4">
        <UserDisplay user={author ?? null} variant="card" size="sm" />
        <div className="flex-col items-end text-right text-xs text-default-500">
          {status !== 'opened' && (
            <motion.p
              className={
                status === 'closed'
                  ? 'text-danger'
                  : status === 'archived'
                    ? 'text-warning'
                    : ''
              }
              {...fadeIn}
              transition={{ delay: 0.4 }}
            >
              <SvgIcon
                icon={status === 'closed' ? 'mdi:lock' : 'mdi:archive'}
                className="inline size-4 xl:mr-1 xl:size-3"
              />
              <span className="hidden xl:inline">
                {status === 'closed' ? 'zamknięto' : 'zarchiwizowano'}
              </span>
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
};
