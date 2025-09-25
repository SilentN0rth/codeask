import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * Pobiera pytanie z liczbą wyświetleń z tabeli question_views
 */
export async function getQuestionWithViewsCount(questionId: string) {
  const supabase = createServerComponentClient({ cookies });

  // Pobierz pytanie
  const { data: question, error: questionError } = await supabase
    .from('questions')
    .select(
      `
      *,
      author:author_id (*),
      tags:question_tags (
        tags (*)
      ),
      answers (*)
    `
    )
    .eq('id', questionId)
    .single();

  if (questionError || !question) {
    return null;
  }

  // Pobierz liczbę wyświetleń
  const { count: viewsCount, error: viewsError } = await supabase
    .from('question_views')
    .select('*', { count: 'exact', head: true })
    .eq('question_id', questionId);

  if (viewsError) {
    console.error('Błąd pobierania liczby wyświetleń:', viewsError);
  }

  // Dodaj liczbę wyświetleń do pytania
  return {
    ...question,
    views_count: viewsCount || 0,
    tags: question.tags?.map((tagRelation: any) => tagRelation.tags) || [],
  };
}

/**
 * Pobiera pytania z liczbą wyświetleń z tabeli question_views
 */
export async function getQuestionsWithViewsCount({
  search,
  sort,
  filter,
  value,
}: {
  search?: string;
  sort?: string;
  filter?: string;
  value?: string;
} = {}) {
  const supabase = createServerComponentClient({ cookies });

  let query = supabase.from('questions').select(`
    *,
    author:author_id (*),
    tags:question_tags (
      tags (*)
    )
  `);

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
      // Dla sortowania po wyświetleniach będziemy musieli to zrobić inaczej
      query = query.order('created_at', { ascending: false });
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
    switch (filter) {
      case 'status':
        query = query.eq('status', value);
        break;
      case 'author':
        query = query.eq('author_id', value);
        break;
    }
  }

  const { data: questions, error } = await query;

  if (error) {
    console.error('getQuestions error:', error.message);
    return { questions: [], error };
  }

  // Pobierz liczbę wyświetleń dla każdego pytania
  const questionsWithViews = await Promise.all(
    (questions || []).map(async (question) => {
      const { count: viewsCount } = await supabase
        .from('question_views')
        .select('*', { count: 'exact', head: true })
        .eq('question_id', question.id);

      return {
        ...question,
        views_count: viewsCount || 0,
        tags: question.tags?.map((tagRelation: any) => tagRelation.tags) || [],
      };
    })
  );

  // Jeśli sortowanie po wyświetleniach, posortuj ręcznie
  if (sort === 'views') {
    questionsWithViews.sort((a, b) => b.views_count - a.views_count);
  }

  return { questions: questionsWithViews, error: null };
}
