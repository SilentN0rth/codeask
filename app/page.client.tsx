'use client';

import { QuestionCardProps } from '@/types/questions.types';
import { Tag } from '@/types/tags.types';
import { UserInterface } from '@/types/users.types';
import { useFadeIn } from '@/lib/animations/useFadeIn';
import { motion } from 'framer-motion';
import { TagsSection } from '@/components/ui/home/TagsSection';
import { UsersSection } from '@/components/ui/home/UsersSection';
import { UnansweredQuestionsSection } from '@/components/ui/home/UnansweredQuestionsSection';
import { NewUsersSection } from '@/components/ui/home/NewUsersSection';
import { QuickActionsSection } from '@/components/ui/home/QuickActionsSection';
import { ExpertQuestionsSection } from '@/components/ui/home/ExpertQuestionsSection';
interface HomePageClientProps {
  stats: {
    totalQuestions: number;
    totalUsers: number;
    totalAnswers: number;
    totalTags: number;
  };
  unansweredQuestions: QuestionCardProps[];
  newTags: Tag[];
  topUsers: UserInterface[];
  expertQuestions: QuestionCardProps[];
  newUsers: UserInterface[];
}

export default function HomePageClient({
  unansweredQuestions,
  newTags,
  topUsers,
  expertQuestions,
  newUsers,
}: HomePageClientProps) {
  const questionsAnimation = useFadeIn(40, 0.5);
  const tagsAnimation = useFadeIn(30, 0.6);
  const usersAnimation = useFadeIn(25, 0.7);
  const expertAnimation = useFadeIn(35, 0.8);
  const newUsersAnimation = useFadeIn(20, 0.9);
  const quickActionsAnimation = useFadeIn(15, 1.0);
  return (
    <motion.div
      className="wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid gap-8 xl:grid-cols-3">
        <div className="space-y-8 xl:col-span-2">
          <UnansweredQuestionsSection
            questions={
              unansweredQuestions.length > 0 ? unansweredQuestions : []
            }
            animation={questionsAnimation}
          />
          <ExpertQuestionsSection
            questions={expertQuestions}
            animation={expertAnimation}
          />
        </div>

        <div className="space-y-8 xl:sticky xl:top-[120px] xl:self-start">
          <QuickActionsSection animation={quickActionsAnimation} />
          <NewUsersSection users={newUsers} animation={newUsersAnimation} />
          <TagsSection tags={newTags} animation={tagsAnimation} />
          <UsersSection users={topUsers} animation={usersAnimation} />
        </div>
      </div>
    </motion.div>
  );
}
