'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { UserInterface } from '@/types/users.types';
import { SortUserOption } from '@/types/searchAndFilters.types';
import PageClient from './page.client';
import { getFollowersWithFollowStatusClient } from '@/services/client/follow';

export default function Page() {
  const { user, loading } = useAuthRedirect();
  const params = useSearchParams();
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [followStatuses, setFollowStatuses] =
    useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useMemo(() => {
    return {
      search: params.get('search') ?? '',
      sort: (params.get('sort') ?? '') as SortUserOption,
    };
  }, [params]);

  useEffect(() => {
    if (loading) return;
    if (!user) return;

    let active = true;
    setIsLoading(true);

    void (async () => {
      const { users, followStatuses } =
        await getFollowersWithFollowStatusClient(searchParams);

      if (!active) return;
      setUsers(users);
      setFollowStatuses(followStatuses);
      setIsLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [user, loading, searchParams]);

  if (loading) {
    return (
      <div className="wrapper">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-b-2 border-cCta-500" />
            <p className="text-cTextDark-100">Sprawdzanie autoryzacji...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageClient
      users={users}
      followStatuses={followStatuses}
      isLoading={isLoading}
    />
  );
}
