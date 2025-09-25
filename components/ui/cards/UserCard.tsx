'use client';

import React, { useState } from 'react';
import { Card } from '@heroui/react';
import { UserInterface } from '@/types/users.types';
import {
  UserCardHeader,
  UserCardContent,
  UserCardStats,
  UserCardActions,
} from './user';

const UserCard: React.FC<{
  user: UserInterface | null;
  isFollowing?: boolean;
}> = ({ user, isFollowing }) => {
  const [hovered, setHovered] = useState(false);

  if (!user) return null;

  return (
    <Card
      shadow="none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative h-full rounded-xl border border-divider bg-cBgDark-800 backdrop-blur-sm transition-all duration-300 hover:border-cCta-500/30 hover:bg-cBgDark-800/80 hover:shadow-lg hover:shadow-cCta-500/10"
    >
      <UserCardHeader user={user} />

      <UserCardContent user={user} />

      <div className="relative h-full overflow-visible p-4 pt-0">
        <div className="flex size-full items-end justify-between">
          <UserCardStats user={user} />

          <UserCardActions
            user={user}
            hovered={hovered}
            isFollowing={isFollowing}
          />
        </div>
      </div>
    </Card>
  );
};

export default UserCard;
