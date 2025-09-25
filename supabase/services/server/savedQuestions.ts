'use server';

import { QuestionCardProps } from '@/types/questions.types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function getSavedQuestions(
  {
    search,
    sort,
    filter,
    value,
    userId,
  }: {
    search?: string;
    sort?: string;
    filter?: string;
    value?: string;
    userId: string;
  } = {} as any
): Promise<{
  questions: QuestionCardProps[];
  error: any;
}> {
  const supabase = createServerComponentClient({ cookies });

  if (!userId) {
    return { questions: [], error: 'Brak ID użytkownika' };
  }

  // Pobierz ID zapisanych pytań dla użytkownika
  const { data: savedData, error: savedError } = await supabase
    .from('saved_questions')
    .select('question_id')
    .eq('user_id', userId);

  if (savedError) {
    console.error('getSavedQuestions error:', savedError.message);
    return { questions: [], error: savedError.message };
  }

  if (!savedData || savedData.length === 0) {
    return { questions: [], error: null };
  }

  // Pobierz pytania na podstawie question_id - jak w getQuestions
  const questionIds = savedData.map((item) => item.question_id);

  let query = supabase
    .from('questions')
    .select(
      `
      *,
      author:author_id (*),
      tags:question_tags (
        tags (*)
      )
    `
    )
    .in('id', questionIds);

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  switch (sort) {
    case 'oldest':
      query = query.order('created_at', { ascending: true });
      break;
    case 'answers':
      query = query.order('answers_count', { ascending: false });
      break;
    case 'likes':
      query = query.order('likes_count', { ascending: false });
      break;
    case 'views':
      query = query.order('views_count', { ascending: false });
      break;
    case 'name':
      query = query.order('title', { ascending: true });
      break;
    case 'status':
      query = query.order('status', { ascending: true });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  if (filter && value) {
    if (filter === 'tags') {
      const { data: tag, error: tagError } = await supabase
        .from('tags')
        .select('id')
        .eq('id', value)
        .single();

      // If tag doesn't exist, return empty results immediately
      if (tagError || !tag) {
        return { questions: [], error: null };
      }

      const { data: questionTags, error: questionTagsError } = await supabase
        .from('question_tags')
        .select('question_id')
        .eq('tag_id', tag.id);

      if (questionTagsError) throw questionTagsError;

      const tagQuestionIds = (questionTags ?? []).map((qt) => qt.question_id);
      const filteredIds = questionIds.filter((id) =>
        tagQuestionIds.includes(id)
      );

      // If no questions found for this tag, return empty results immediately
      if (filteredIds.length === 0) {
        return { questions: [], error: null };
      }

      // If questions found, filter by them
      query = query.in('id', filteredIds);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching questions:', error);
    return { questions: [], error: error.message };
  }

  // Przekształć dane do odpowiedniego formatu
  const formattedQuestions = (data || []).map((question) => ({
    ...question,
    tags: question.tags?.map((tagRelation: any) => tagRelation.tags) || [],
  }));

  return { questions: formattedQuestions as QuestionCardProps[], error: null };
}
