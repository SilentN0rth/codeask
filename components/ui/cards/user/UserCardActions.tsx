'use client';

import Link from 'next/link';
import { Tooltip, Button } from '@heroui/react';
import { motion } from 'framer-motion';
import { SvgIcon } from '@/lib/utils/icons';
import { useState } from 'react';
import { UserInterface } from '@/types/users.types';
import { useAuthContext } from 'context/useAuthContext';
import {
  followUser,
  unfollowUser,
} from '../../../../supabase/services/client/follow';

interface UserCardActionsProps {
  user: UserInterface;
  hovered: boolean;
  isFollowing?: boolean;
}

export const UserCardActions: React.FC<UserCardActionsProps> = ({
  user,
  hovered,
  isFollowing: initialIsFollowing = null,
}) => {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(
    initialIsFollowing
  );
  const [isLoading, setIsLoading] = useState(false);
  const { user: currentUser } = useAuthContext();

  const isOwnProfile = currentUser?.id === user.id;

  const handleFollowToggle = async () => {
    if (!currentUser?.id || !user.id) return;

    setIsLoading(true);
    try {
      let updatedUser: UserInterface | null = null;

      if (isFollowing) {
        updatedUser = await unfollowUser(currentUser.id, user.id);
        if (updatedUser) {
          setIsFollowing(false);
        }
      } else {
        updatedUser = await followUser(currentUser.id, user.id);
        if (updatedUser) {
          setIsFollowing(true);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {!isOwnProfile && isFollowing !== null && (
        <Tooltip
          content={isFollowing ? 'Przestań obserwować' : 'Obserwuj'}
          placement="top"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: hovered ? 1 : 0,
              x: hovered ? 0 : -20,
            }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none"
            style={{ pointerEvents: hovered ? 'auto' : 'none' }}
          >
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => void handleFollowToggle()}
              isLoading={isLoading}
              className={`transition-all duration-300 ${
                isFollowing
                  ? 'bg-cCta-500/20 text-cCta-500 hover:bg-cCta-500/30'
                  : 'text-default-500 hover:bg-cCta-500/10 hover:text-white'
              }`}
            >
              <SvgIcon
                icon={isFollowing ? 'mdi:star' : 'mdi:star-outline'}
                width={20}
              />
            </Button>
          </motion.div>
        </Tooltip>
      )}

      <Tooltip content="Zobacz profil" placement="top">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{
            opacity: hovered ? 1 : 0,
            x: hovered ? 0 : 20,
          }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none"
          style={{ pointerEvents: hovered ? 'auto' : 'none' }}
        >
          <Button
            as={Link}
            href={`/users/${user.profile_slug}`}
            isIconOnly
            size="sm"
            variant="light"
            aria-label="Zobacz profil użytkownika"
            className="flex items-center justify-center rounded-lg bg-cCta-500/10 text-cCta-500 transition-all duration-300 hover:bg-cCta-500 hover:text-white"
          >
            <SvgIcon icon="mdi:arrow-right" width={20} />
          </Button>
        </motion.div>
      </Tooltip>
    </div>
  );
};
