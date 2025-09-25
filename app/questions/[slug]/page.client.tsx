'use client';

import { useState, useEffect } from 'react';
import { Divider } from '@heroui/react';
import QuestionTags from '@/components/ui/question/QuestionTags';
import QuestionContent from '@/components/ui/question/QuestionContent';
import Answers from '@/components/ui/answers/Answers';
import { QuestionCardProps } from '@/types/questions.types';
import QuestionStickyMenu from '@/components/ui/question/QuestionStickyMenu';
import { refreshQuestion } from '@/services/client/questions';
import QuestionEditInfo from '@/components/ui/question/QuestionEditInfo';
import { trackQuestionView } from '@/services/client/questionViews';
import { useSingleQuestionViewsRealtime } from '@/hooks/useQuestionViewsRealtime';

export default function QuestionPageClient({
  question,
}: {
  question: QuestionCardProps;
}) {
  const [questionData, setQuestionData] = useState<QuestionCardProps>(question);

  const realtimeQuestion = useSingleQuestionViewsRealtime(question);
  useEffect(() => {
    const timer = setTimeout(() => {
      void trackQuestionView(question.id);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [question.id]);

  const handleStatusChange = (newStatus: 'opened' | 'closed' | 'archived') => {
    setQuestionData((prev) => ({ ...prev, status: newStatus }));

    void refreshQuestion(question.id, setQuestionData);
  };

  return (
    <article className="flex-column w-full gap-5">
      <QuestionStickyMenu
        question={realtimeQuestion}
        status={questionData.status}
        onStatusChange={handleStatusChange}
      />

      <div className="wrapper flex-column w-full gap-5">
        <div className="flex flex-col gap-4">
          <QuestionEditInfo questionUpdatedAt={questionData.updated_at} />
          <QuestionTags tags={questionData.tags} />
          <QuestionContent
            title={questionData.title}
            content={questionData.content}
            status={questionData.status}
          />
        </div>

        <Divider />

        <div
          id="answers"
          className="flex w-full flex-col items-start justify-start"
        >
          <div className="mb-4 flex w-full flex-wrap items-end justify-between gap-x-2">
            <h2 className="relative pl-3 text-base font-semibold before:absolute before:inset-0 before:h-full before:w-0.5 before:bg-cCta-500 before:content-['']">
              Odpowiedz na pytanie
            </h2>
            {questionData.status === 'opened' && (
              <p className="hidden text-cMuted-500 text-tiny sm:block">
                {questionData.answers_count === 0
                  ? 'bądź pierwszy, kto pomoże!'
                  : 'dołącz do wspólnej dyskusji!'}
              </p>
            )}
          </div>
          <Answers question={questionData} setQuestion={setQuestionData} />
        </div>
      </div>
    </article>
  );
}
