'use client';

import React from 'react';
import { UserInterface } from '@/types/users.types';
import UserCard from '@/components/ui/cards/UserCard';

interface UsersGridProps {
  users: UserInterface[];
}

const UsersGrid: React.FC<UsersGridProps> = ({ users }) => {
  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UsersGrid;
