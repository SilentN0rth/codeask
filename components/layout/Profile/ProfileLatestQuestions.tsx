'use client';

import React, { useEffect, useState } from 'react';
import { QuestionCardProps } from '@/types/questions.types';
import { QuestionCard } from '@/components/ui/cards/QuestionCard';
import { QuestionSkeleton } from '@/components/ui/cards/question/QuestionSkeleton';
import { getUserLatestQuestions } from '@/services/server';
import NoResults from '@/components/ui/effects/NoResults';
import SeeAllButton from '@/components/ui/SeeAllButton';
import { supabase } from 'supabase/supabaseClient';

interface ProfileLatestQuestionsProps {
  userId: string;
}

const ProfileLatestQuestions = ({ userId }: ProfileLatestQuestionsProps) => {
  const [questions, setQuestions] = useState<QuestionCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedQuestionIds, setSavedQuestionIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchLatestQuestions = async () => {
      try {
        setLoading(true);
        const [
          { questions: latestQuestions, error },
          {
            data: { user },
          },
        ] = (await Promise.all([
          getUserLatestQuestions(userId, 3),
          supabase.auth.getUser(),
        ])) as [
          { questions: QuestionCardProps[]; error: unknown },
          { data: { user: unknown } },
        ];

        if (error) {
          setError(error as string);
        } else {
          setQuestions(latestQuestions);
        }

        if (user) {
          const userData = user as { id: string };
          const { data: savedData } = await supabase
            .from('saved_questions')
            .select('question_id')
            .eq('user_id', userData.id);

          setSavedQuestionIds(
            (savedData as { question_id: string }[])?.map(
              (item) => item.question_id
            ) ?? []
          );
        }
      } catch {
        setError('Wystąpił błąd podczas pobierania pytań');
      } finally {
        setLoading(false);
      }
    };

    void fetchLatestQuestions();
  }, [userId]);

  if (loading) {
    return (
      <div className="col-span-full">
        <div className="columns-1 gap-5 space-y-5 md:columns-2 lg:columns-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-5 break-inside-avoid">
              <QuestionSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <NoResults
        title="Błąd"
        description={`Wystąpił błąd podczas pobierania pytań: ${error}`}
        hint="Spróbuj ponownie później."
        icon="lucide:alert-circle"
        className="col-span-full"
        childClassName="w-full"
      />
    );
  }

  if (questions.length === 0) {
    return (
      <NoResults
        title="Brak pytań"
        className="col-span-full"
        description="Nie znaleziono pytań użytkownika."
        hint=""
        icon="lucide:search-x"
        childClassName="w-full"
      />
    );
  }

  return (
    <div className="col-span-full">
      <div className="columns-1 gap-5 space-y-5 md:columns-2 lg:columns-3">
        {questions.map((question) => (
          <div key={question.id} className="mb-5 break-inside-avoid">
            <QuestionCard {...question} savedQuestionIds={savedQuestionIds} />
          </div>
        ))}
      </div>

      {questions.length > 0 && (
        <div className="mt-6 flex justify-center">
          <SeeAllButton href={`/questions?filter=user&value=${userId}`}>
            Zobacz wszystkie pytania
          </SeeAllButton>
        </div>
      )}
    </div>
  );
};

export default ProfileLatestQuestions;
