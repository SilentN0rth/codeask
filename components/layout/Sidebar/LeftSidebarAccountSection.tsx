import { cn } from '@heroui/react';
import React from 'react';
import LeftSidebarSignedInLoginButtons from './LeftSidebarSignedInLoginButtons';
import LeftSidebarSignedOutLoginButtons from './LeftSidebarSignedOutLoginButtons';
import LeftSidebarUtilityButtons from './LeftSidebarUtilityButtons';
import { useAuthContext } from 'context/useAuthContext';
import LeftSidebarAccountSectionSkeleton from './LeftSidebarAccountSectionSkeleton';

const LeftSidebarAccountSection = ({
  isCompact,
  toggleCompact,
}: {
  isCompact: boolean;
  toggleCompact: () => void;
}) => {
  const { user, signOut, loading } = useAuthContext();

  return loading ? (
    <LeftSidebarAccountSectionSkeleton />
  ) : (
    <div className="relative">
      <span
        className={`text-foreground-500 text-tiny ${isCompact ? 'sidebar-compact-headings mr-4' : 'mb-1'}`}
      >
        Konto
      </span>
      <div
        className={cn('mt-auto flex flex-col', {
          'items-center px-2': isCompact,
          'gap-xsmall': !isCompact,
        })}
      >
        <LeftSidebarSignedOutLoginButtons isCompact={isCompact} user={user} />
        <LeftSidebarSignedInLoginButtons
          user={user}
          signOut={signOut}
          isCompact={isCompact}
        />

        <LeftSidebarUtilityButtons
          toggleCompact={toggleCompact}
          isCompact={isCompact}
        />
      </div>
    </div>
  );
};

export default LeftSidebarAccountSection;
