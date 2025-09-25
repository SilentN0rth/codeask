'use client';

import { motion } from 'framer-motion';
import { useFadeIn } from '@/lib/animations/useFadeIn';
import PageTitle from '@/components/ui/PageTitle';
import NoResults from '@/components/ui/effects/NoResults';
import { LeaderboardTable } from '@/components/ui/leaderboard';
import { UserInterface } from '@/types/users.types';

interface LeaderboardPageClientProps {
  users: UserInterface[];
}

export default function LeaderboardPageClient({
  users,
}: LeaderboardPageClientProps) {
  const titleAnimation = useFadeIn(30, 0.4);
  const tableAnimation = useFadeIn(40, 0.6);

  if (!users || users.length === 0) {
    return (
      <motion.div
        className="wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div {...titleAnimation}>
          <PageTitle
            title="Tablica wyników"
            icon="material-symbols:trophy-outline"
            description="Ranking najlepszych użytkowników"
          />
        </motion.div>
        <motion.div {...tableAnimation}>
          <NoResults
            title="Brak użytkowników"
            description="Nie udało się załadować listy użytkowników."
            hint="Spróbuj odświeżyć stronę lub skontaktuj się z administratorem."
            icon="mdi:account-group-off"
          />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div {...titleAnimation}>
        <PageTitle
          title="Tablica wyników"
          icon="material-symbols:trophy-outline"
          description="Ranking najlepszych użytkowników"
          parentClasses="mb-6"
        />
      </motion.div>

      <motion.div {...tableAnimation}>
        <LeaderboardTable users={users} />
      </motion.div>
    </motion.div>
  );
}
