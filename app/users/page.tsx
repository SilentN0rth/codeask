import { getUsersWithFollowStatus } from '@/services/server/users';
import PageClient from './page.client';
import { SortUserOption } from '@/types/searchAndFilters.types';

type Props = {
  searchParams?: Promise<{
    search?: string;
    sort?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const { users, followStatuses } = await getUsersWithFollowStatus({
    search: resolvedSearchParams?.search,
    sort: resolvedSearchParams?.sort as SortUserOption,
  });

  if (!users) {
    return <div>Nie udało się załadować użytkowników.</div>;
  }

  return <PageClient users={users} followStatuses={followStatuses} />;
}
