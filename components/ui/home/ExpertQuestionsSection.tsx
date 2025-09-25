'use client';

import { QuestionCardProps } from '@/types/questions.types';
import { motion } from 'framer-motion';
import { QuestionCard } from '@/components/ui/cards/QuestionCard';
import PageTitle from '../PageTitle';
import { Masonry } from 'masonic';
import SeeAllButton from '../SeeAllButton';
import { useSidebarContext } from 'context/LeftSidebarContext';

interface ExpertQuestionsSectionProps {
  questions: QuestionCardProps[];
  animation: Record<string, unknown>;
}

export function ExpertQuestionsSection({
  questions,
  animation,
}: ExpertQuestionsSectionProps) {
  const { isCompact } = useSidebarContext();

  const QuestionCardWrapper = ({
    data: question,
  }: {
    data: QuestionCardProps;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: 0.1,
        ease: 'easeOut',
      }}
    >
      <QuestionCard {...question} />
    </motion.div>
  );

  return (
    <motion.div {...animation} className="">
      <PageTitle
        title="Eksperci odpowiadają"
        as="h2"
        icon="mdi:wrench-outline"
        description="Odpowiedzi od użytkowników z wysoką reputacją"
        iconClasses="hidden lg:flex"
        parentClasses="mb-6 flex flex-col gap-2 md:flex-row justify-between"
      >
        <SeeAllButton className="place-self-start" href="/questions">
          Zobacz wszystkie
        </SeeAllButton>
      </PageTitle>

      <motion.div {...animation}>
        {questions.length > 0 ? (
          <Masonry
            key={`expert-masonry-${questions.length}-${questions[0]?.id || 'empty'}-${isCompact}`}
            items={questions}
            columnGutter={16}
            columnWidth={isCompact ? 280 : 300}
            overscanBy={1}
            itemKey={(data) => data?.id || Math.random().toString()}
            render={QuestionCardWrapper}
            as="ul"
            itemAs="li"
            role="list"
            aria-label="Lista pytań ekspertów w układzie masonry"
          />
        ) : (
          <div className="py-8 text-center text-cTextDark-100">
            <p>Brak pytań od ekspertów w tym momencie.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
