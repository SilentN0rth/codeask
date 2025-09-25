'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import TagQuestionsPage from '@/components/layout/TagQuestionsPage';
import { Tag } from '@/types/tags.types';
import {
  getTagByName,
  getQuestionsByTagNameWithFilters,
} from '@/services/server';
import { getUsers } from '@/services/server/users';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ name: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { name } = resolvedParams;
  const { search, sort, filter, value } = resolvedSearchParams;

  const { tag, error: tagError } = (await getTagByName(name)) as {
    tag: Tag | null;
    error: unknown;
  };

  if (tagError || !tag) {
    notFound();
  }

  const { questions } = await getQuestionsByTagNameWithFilters(name, {
    search,
    sort,
    filter,
    value,
  });

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
    <TagQuestionsPage
      tag={tag}
      questions={questions}
      savedQuestionIds={savedQuestionIds}
      users={users}
    />
  );
}
