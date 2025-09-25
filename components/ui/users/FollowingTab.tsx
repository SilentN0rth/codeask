'use client';

import { UserInterface } from '@/types/users.types';
import { useState, useEffect } from 'react';
import { useAuthContext } from 'context/useAuthContext';
import { getFollowersUsers } from '/Users/maksymilian/Documents/GitHub/codeask/supabase/services/client/follow';
import Loading from '@/components/ui/Loading';
import NoResults from '@/components/ui/effects/NoResults';
import UsersGrid from './UsersGrid';

interface FollowingTabProps {
  search?: string;
  sort?: string;
}

export default function FollowingTab({ search, sort }: FollowingTabProps) {
  const { user: currentUser } = useAuthContext();
  const [followersUsers, setFollowersUsers] = useState<UserInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFollowersUsers = async () => {
      if (!currentUser?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const users = await getFollowersUsers(currentUser.id);
        setFollowersUsers(users);
      } finally {
        setIsLoading(false);
      }
    };

    void loadFollowersUsers();
  }, [currentUser?.id, search, sort]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (followersUsers.length === 0) {
    return (
      <NoResults
        title="Brak obserwujących"
        description="Nikt jeszcze Cię nie obserwuje."
        hint="Bądź aktywny na platformie, aby przyciągnąć obserwujących!"
        icon="lucide:users"
      />
    );
  }

  return <UsersGrid users={followersUsers} />;
}
