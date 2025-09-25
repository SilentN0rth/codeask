import { SvgIcon } from '@/lib/utils/icons';
import { Button, Chip, Tooltip } from '@heroui/react';
import { UserInterface } from '@/types/users.types';
import { useAuthContext } from 'context/useAuthContext';
import { useEffect, useState } from 'react';
import {
  isFollowing,
  followUser,
  unfollowUser,
} from '@/services/client/follow';

export default function ProfileCardHeaderActions({
  author,
  onFollowChanged,
  skipFollowCheck = false,
}: {
  author: UserInterface | null;
  onFollowChanged?: () => void;
  skipFollowCheck?: boolean;
}) {
  const { user: loggedUser, refreshUser } = useAuthContext();
  const isModerator = author?.is_moderator;

  const [isFollowingState, setIsFollowingState] = useState<boolean | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (skipFollowCheck) {
      setIsFollowingState(false);
      return;
    }

    if (loggedUser?.id && author?.id && loggedUser.id !== author.id) {
      void (async () => {
        try {
          const following = await isFollowing(loggedUser.id, author.id);
          setIsFollowingState(following);
        } catch {
          setIsFollowingState(false);
        }
      })();
    } else if (loggedUser?.id === author?.id) {
      setIsFollowingState(null);
    } else {
      setIsFollowingState(false);
    }
  }, [loggedUser?.id, author?.id, skipFollowCheck]);

  const onToggleFollow = async () => {
    if (!loggedUser?.id || !author?.id) return;

    setLoading(true);

    let updatedUser: UserInterface | null = null;

    if (isFollowingState) {
      updatedUser = await unfollowUser(loggedUser.id, author.id);
      if (updatedUser) setIsFollowingState(false);
    } else {
      updatedUser = await followUser(loggedUser.id, author.id);
      if (updatedUser) setIsFollowingState(true);
    }

    if (updatedUser && onFollowChanged) {
      onFollowChanged();
    }

    void refreshUser();
    setLoading(false);
  };

  const shouldShowFollowButton =
    loggedUser?.id && author?.id && loggedUser.id !== author.id;

  if (isModerator && shouldShowFollowButton) {
    return (
      <div className="z-30 mb-5 flex w-full flex-wrap items-center justify-between gap-6">
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
    );
  }

  if (isModerator && !shouldShowFollowButton) {
    return (
      <div className="z-30 mb-5 flex w-full flex-wrap items-center justify-start gap-6">
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
      </div>
    );
  }

  return null;
}
