'use client';

import { Chip } from '@heroui/react';

import { motion } from 'framer-motion';
import { useFadeIn } from '@/lib/animations/useFadeIn';

import { UserInterface } from '@/types/users.types';
import { SvgIcon } from '@/lib/utils/icons';
import UserDisplay from '@/components/ui/UserDisplay';

interface UserCardHeaderProps {
  user: UserInterface;
}

export const UserCardHeader: React.FC<UserCardHeaderProps> = ({ user }) => {
  const fadeIn = useFadeIn(0, 0.3);

  return (
    <div className="flex w-full justify-between gap-4 p-4 pb-2">
      <div className="flex flex-col gap-2">
        {user.is_moderator && (
          <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
            <Chip
              startContent={
                <SvgIcon icon="mdi:crown" className="ml-1" width={16} />
              }
              color="danger"
              radius="sm"
              variant="flat"
            >
              Administrator
            </Chip>
          </motion.div>
        )}

        <UserDisplay
          user={user}
          variant="profile"
          size="sm"
          linkToProfile
          withIndicator={false}
        />
      </div>

      <motion.div {...fadeIn} transition={{ delay: 0.4 }}>
        {user.is_online ? (
          <div className="flex items-center gap-1 rounded-full bg-success/20 px-2 py-1 text-xs text-success">
            <div className="size-2 animate-pulse rounded-full bg-success" />
            Online
          </div>
        ) : (
          <div className="flex items-center gap-1 rounded-full bg-default-400/20 px-2 py-1 text-xs text-default-400">
            <div className="size-2 rounded-full bg-default-400" />
            Offline
          </div>
        )}
      </motion.div>
    </div>
  );
};
