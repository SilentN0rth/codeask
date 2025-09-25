import UserTriggerSkeletonPopoverCard from '@/components/ui/cards/UserTriggerSkeletonPopoverCard';
import UserTriggerPopoverCard from '@/components/ui/cards/YourAccountUserCard';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { cn } from '@heroui/react';
import { useAuthContext } from 'context/useAuthContext';
import React from 'react';

const LeftSidebarUserPopoverCard = ({ isCompact }: { isCompact: boolean }) => {
  const { user, loading, error } = useAuthContext();

  if (loading) return <UserTriggerSkeletonPopoverCard />;
  if (error) {
    return (
      <div className={cn('w-full', { 'flex justify-center': isCompact })}>
        <ErrorMessage
          message="Błąd ładowania użytkownika"
          iconSize="lg"
          className={isCompact ? 'justify-center' : ''}
        />
      </div>
    );
  }

  return (
    <div>
      <UserTriggerPopoverCard isCompact={isCompact} user={user} />
    </div>
  );
};

export default LeftSidebarUserPopoverCard;
