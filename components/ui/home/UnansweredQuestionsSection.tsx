'use client';

import { motion } from 'framer-motion';
import { QuestionCard } from '../cards/QuestionCard';
import { QuestionCardProps } from '@/types/questions.types';
import PageTitle from '../PageTitle';
import { Masonry } from 'masonic';
import SeeAllButton from '../SeeAllButton';
import { useSidebarContext } from 'context/LeftSidebarContext';

interface UnansweredQuestionsSectionProps {
  questions: QuestionCardProps[];
  animation: Record<string, unknown>;
}

export const UnansweredQuestionsSection = ({
  questions,
  animation,
}: UnansweredQuestionsSectionProps) => {
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
        title="Pytania bez odpowiedzi"
        as="h1"
        icon="mdi:help-circle-outline"
        description="Pytania, które potrzebują Twojej pomocy"
        iconClasses="hidden lg:flex"
        parentClasses="mb-6 flex flex-col gap-2 md:flex-row justify-between"
      >
        <SeeAllButton
          className="place-self-start"
          href="/questions?filter=answers&value=0"
        >
          Zobacz wszystkie
        </SeeAllButton>
      </PageTitle>

      <motion.div {...animation}>
        <Masonry
          key={`masonry-${questions.length}-${questions[0]?.id || 'empty'}-${isCompact}`}
          items={questions}
          columnGutter={16}
          columnWidth={isCompact ? 280 : 300}
          overscanBy={1}
          itemKey={(data) => data?.id || Math.random().toString()}
          render={QuestionCardWrapper}
          as="ul"
          itemAs="li"
          role="list"
          aria-label="Lista pytań bez odpowiedzi w układzie masonry"
        />
      </motion.div>
    </motion.div>
  );
};
