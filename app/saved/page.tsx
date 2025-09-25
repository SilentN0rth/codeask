'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SavedQuestionsPage from '../../components/layout/SavedQuestionsPage';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { QuestionCardProps } from '@/types/questions.types';
import { getSavedQuestionsClient } from '@/services/client/savedQuestions';

export default function Page() {
  const { user, loading } = useAuthRedirect();
  const params = useSearchParams();
  const [questions, setQuestions] = useState<QuestionCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useMemo(() => {
    return {
      search: params.get('search') ?? '',
      sort: params.get('sort') ?? '',
      filter: params.get('filter') ?? '',
      value: params.get('value') ?? '',
    };
  }, [params]);

  useEffect(() => {
    if (loading) return;
    if (!user) return;

    let active = true;
    setIsLoading(true);

    void (async () => {
      const result = await getSavedQuestionsClient(searchParams);

      if (!active) return;
      if (!result.error) setQuestions(result.questions);
      setIsLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [user, loading, searchParams]);

  return (
    <SavedQuestionsPage
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      questions={questions}
    />
  );
}
