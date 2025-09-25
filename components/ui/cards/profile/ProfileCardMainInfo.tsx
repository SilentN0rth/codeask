import { Tooltip, Button } from '@heroui/react';

import { UserInterface } from '@/types/users.types';
import { SvgIcon } from '@/lib/utils/icons';
import { useAuthContext } from 'context/useAuthContext';
import { useEffect, useState } from 'react';
import {
  isFollowing,
  followUser,
  unfollowUser,
} from '@/services/client/follow';
import UserDisplay from '@/components/ui/UserDisplay';

export default function ProfileCardMainInfo({
  user,
  onFollowChanged,
  skipFollowCheck = false,
}: {
  user: UserInterface | null;
  onFollowChanged?: () => void;
  skipFollowCheck?: boolean;
}) {
  const { user: loggedUser, refreshUser } = useAuthContext();

  const [isFollowingState, setIsFollowingState] = useState<boolean | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (skipFollowCheck) {
      setIsFollowingState(false);
      return;
    }

    if (loggedUser?.id && user?.id && loggedUser.id !== user.id) {
      void (async () => {
        try {
          const following = await isFollowing(loggedUser.id, user.id);
          setIsFollowingState(following);
        } catch {
          setIsFollowingState(false);
        }
      })();
    } else if (loggedUser?.id === user?.id) {
      setIsFollowingState(null);
    } else {
      setIsFollowingState(false);
    }
  }, [loggedUser?.id, user?.id, skipFollowCheck]);

  const onToggleFollow = async () => {
    if (!loggedUser?.id || !user?.id) return;

    setLoading(true);

    let updatedUser: UserInterface | null = null;

    if (isFollowingState) {
      updatedUser = await unfollowUser(loggedUser.id, user.id);
      if (updatedUser) setIsFollowingState(false);
    } else {
      updatedUser = await followUser(loggedUser.id, user.id);
      if (updatedUser) setIsFollowingState(true);
    }

    if (updatedUser && onFollowChanged) {
      onFollowChanged();
    }

    void refreshUser();
    setLoading(false);
  };

  const shouldShowFollowButton =
    loggedUser?.id &&
    user?.id &&
    loggedUser.id !== user.id &&
    !user?.is_moderator;

  return (
    <div className="z-30 flex w-full items-start justify-between gap-5">
      <UserDisplay
        user={user}
        variant="profile"
        size="lg"
        linkToProfile={false}
      />

      {shouldShowFollowButton && (
        <div className="flex items-center">
          <Tooltip
            content={
              isFollowingState
                ? 'Przestań obserwować tego użytkownika'
                : 'Zacznij obserwować tego użytkownika'
            }
          >
            <Button
              onPress={() => void onToggleFollow()}
              variant="light"
              radius="md"
              isIconOnly
              isLoading={loading || isFollowingState === null}
              aria-label={
                isFollowingState ? 'Przestań obserwować' : 'Zacznij obserwować'
              }
              disabled={loading || isFollowingState === null}
              className={`bg-cBgDark-800 transition-colors sm:bg-cBgDark-700 md:!min-w-fit md:!px-3 ${
                isFollowingState
                  ? 'bg-yellow-500/10 text-yellow-400 hover:!bg-yellow-500/20'
                  : 'text-cTextDark-100 hover:bg-white/5'
              } ${isFollowingState === null ? 'opacity-50' : ''}`}
              startContent={
                loading ||
                isFollowingState === null || (
                  <SvgIcon
                    icon={isFollowingState ? 'mdi:star' : 'mdi:star-outline'}
                    className="text-xl"
                  />
                )
              }
            />
          </Tooltip>
        </div>
      )}
    </div>
  );
}
