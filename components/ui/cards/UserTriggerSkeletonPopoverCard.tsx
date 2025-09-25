import { Skeleton } from '@heroui/react';
import React from 'react';

const UserTriggerSkeletonPopoverCard = ({
  longSubText = false,
}: {
  longSubText?: boolean;
}) => {
  return (
    <div className="flex w-full max-w-[300px] items-center gap-3">
      <div>
        <Skeleton className="flex size-8 rounded-full" />
      </div>
      <div className="flex w-full flex-col gap-2">
        <Skeleton
          className={`h-3 ${longSubText ? 'w-2/5' : 'w-3/5'} rounded-lg`}
        />
        <Skeleton
          className={`h-3 ${longSubText ? 'w-3/5' : 'w-1/5'} rounded-lg`}
        />
      </div>
    </div>
  );
};

export default UserTriggerSkeletonPopoverCard;
