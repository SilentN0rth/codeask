'use server';

import { getQuestions } from '@/services/server/questions';
import { getUsers } from '@/services/server/users';
import QuestionsPage from '../../components/layout/QuestionsPage';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const resolvedSearchParams = await searchParams;
  const { search, sort, filter, value } = resolvedSearchParams;

  const { questions } = await getQuestions({ search, sort, filter, value });

  const users = await getUsers({ limit: 100 });

  let savedQuestionIds: string[] = [];
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: savedData } = await supabase
      .from('saved_questions')
      .select('question_id')
      .eq('user_id', user.id);

    savedQuestionIds =
      (savedData as { question_id: string }[])?.map(
        (item) => item.question_id
      ) ?? [];
  }

  if (!questions) return <div>Nie udało się załadować pytań.</div>;
  return (
    <QuestionsPage
      questions={questions}
      savedQuestionIds={savedQuestionIds}
      users={users}
    />
  );
}
