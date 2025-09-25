'use server';

import {
  getHomepageStats,
  getUnansweredQuestions,
  getExpertQuestions,
} from '@/services/server/questions';
import { getNewTags } from '@/services/server/tags';
import { getTopUsers, getNewUsers } from '@/services/server/users';
import HomePageClient from '@/app/page.client';

export default async function HomePage() {
  const [
    stats,
    unansweredQuestions,
    newTags,
    topUsers,
    expertQuestions,
    newUsers,
  ] = await Promise.all([
    getHomepageStats(),
    getUnansweredQuestions(12),
    getNewTags(8),
    getTopUsers(5),
    getExpertQuestions(6),
    getNewUsers(5),
  ]);

  return (
    <HomePageClient
      stats={stats}
      unansweredQuestions={unansweredQuestions}
      newTags={newTags}
      topUsers={topUsers}
      expertQuestions={expertQuestions}
      newUsers={newUsers}
    />
  );
}
