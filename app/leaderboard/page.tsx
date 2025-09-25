import { getUsers } from '@/services/server/users';
import { LeaderboardSkeleton } from '@/components/ui/leaderboard/LeaderboardSkeleton';
import PageTitle from '@/components/ui/PageTitle';
import { Suspense } from 'react';
import LeaderboardPageClient from './page.client';

export default function LeaderboardPage() {
  return (
    <Suspense
      fallback={
        <div className="wrapper">
          <PageTitle
            title="Tablica wyników"
            icon="material-symbols:trophy-outline"
            description="Ranking najlepszych użytkowników"
            parentClasses="mb-6"
          />
          <LeaderboardSkeleton />
        </div>
      }
    >
      <LeaderboardContent />
    </Suspense>
  );
}

async function LeaderboardContent() {
  try {
    const users = await getUsers({ sort: 'mostReputation' });

    return <LeaderboardPageClient users={users || []} />;
  } catch {
    return <LeaderboardPageClient users={[]} />;
  }
}
