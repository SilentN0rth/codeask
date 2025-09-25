'use server';
import { QuestionCardProps } from '@/types/questions.types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { supabase } from 'supabase/supabaseClient';
import { generateUniqueSlugForUpdate } from '@/lib/utils/generateSlug';
import { highlightCodeInHTML } from '@/lib/utils/codeHighlighter';

// Funkcja do usuwania pustych tagów
async function cleanupEmptyTags(supabase: any) {
  try {
    // Znajdź wszystkie tagi z question_count = 0
    const { data: emptyTags, error: selectError } = await supabase
      .from('tags')
      .select('id, name')
      .eq('question_count', 0);

    if (selectError) {
      console.error('Error selecting empty tags:', selectError);
      return;
    }

    if (!emptyTags || emptyTags.length === 0) {
      return; // Brak pustych tagów do usunięcia
    }

    // Usuń puste tagi
    const { error: deleteError } = await supabase
      .from('tags')
      .delete()
      .eq('question_count', 0);

    if (deleteError) {
      console.error('Error deleting empty tags:', deleteError);
    } else {
      console.log(
        `Usunięto ${emptyTags.length} pustych tagów:`,
        emptyTags.map((tag: any) => tag.name)
      );
    }
  } catch (error) {
    console.error('Error in cleanupEmptyTags:', error);
  }
}

export async function checkSlugExistsForUpdate(
  slug: string,
  excludeId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('questions')
    .select('id')
    .eq('question_slug', slug)
    .neq('id', excludeId) // Wyklucz aktualne pytanie
    .single();

  if (error && error.code === 'PGRST116') {
    // No rows found - slug doesn't exist
    return false;
  }

  if (error) {
    console.error('checkSlugExistsForUpdate error:', error.message);
    return false;
  }

  // If we get data, slug exists
  return !!data;
}

export async function checkSlugExists(slug: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('questions')
    .select('id')
    .eq('question_slug', slug)
    .single();

  if (error && error.code === 'PGRST116') {
    // No rows found - slug doesn't exist
    return false;
  }

  if (error) {
    console.error('checkSlugExists error:', error.message);
    return false;
  }

  // If we get data, slug exists
  return !!data;
}

export async function getQuestionBySlug(
  slug: string
): Promise<QuestionCardProps | null> {
  const { data, error } = await supabase
    .from('questions')
    .select(
      `
            *,
            author:author_id (
                *
            ),
            tags:question_tags (
                tags (*)
            ),
            answers (
                *
            )
            `
    )
    .eq('question_slug', slug)
    .single();

  if (error) {
    console.error('getQuestionBySlug error:', error.message);
    return null;
  }

  // Pobierz liczbę wyświetleń z tabeli question_views
  const { count: viewsCount } = await supabase
    .from('question_views')
    .select('*', { count: 'exact', head: true })
    .eq('question_id', data.id);

  if (data?.answers) {
    data.answers.sort(
      (a: any, b: any) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }

  return {
    ...data,
    views_count: viewsCount || 0,
    tags: data.tags?.map((tagRelation: any) => tagRelation.tags) || [],
  };
}

export async function getQuestionById(
  id: string
): Promise<QuestionCardProps | null> {
  const { data, error } = await supabase
    .from('questions')
    .select(
      `
            *,
            author:author_id (
                *
            ),
            tags (
                *
            ),
            answers (
                *
            )
            `
    )
    .eq('id', id)
    .single();

  if (error) {
    console.error('getQuestionById error:', error.message);
    return null;
  }
  if (data?.answers) {
    data.answers.sort(
      (a: any, b: any) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }
  return data;
}

export async function getQuestions({
  search,
  sort,
  filter,
  value,
}: {
  search?: string;
  sort?: string;
  filter?: string;
  value?: string;
} = {}): Promise<{ questions: QuestionCardProps[]; error: any }> {
  const supabase = createServerComponentClient({ cookies });

  let query = supabase.from('questions').select(
    `
        *,
        author:author_id (*),
        tags:question_tags (
          tags (*)
        )
      `
  );

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
    if (filter === 'user') {
      query = query.eq('author_id', value);
    } else if (filter === 'tags') {
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

      const questionIds = (questionTags ?? []).map((qt) => qt.question_id);

      // If no questions found for this tag, return empty results immediately
      if (questionIds.length === 0) {
        return { questions: [], error: null };
      }

      // If questions found, filter by them
      query = query.in('id', questionIds);
    }
  }

  const { data, error } = await query;

  if (error) throw error;

  // Przekształć dane do odpowiedniego formatu
  const formattedQuestions = (data || []).map((question) => ({
    ...question,
    tags: question.tags?.map((tagRelation: any) => tagRelation.tags) || [],
  }));

  return { questions: formattedQuestions as QuestionCardProps[], error };
}

export async function getNewestQuestions(): Promise<{
  questions: QuestionCardProps[];
  error: any;
}> {
  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase
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
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;

  // Przekształć dane do odpowiedniego formatu
  const formattedQuestions = (data || []).map((question) => ({
    ...question,
    tags: question.tags?.map((tagRelation: any) => tagRelation.tags) || [],
  }));

  return { questions: formattedQuestions as QuestionCardProps[], error };
}

export async function getUserLatestQuestions(
  userId: string,
  limit: number = 3
): Promise<{
  questions: QuestionCardProps[];
  error: any;
}> {
  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase
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
    .eq('author_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('getUserLatestQuestions error:', error.message);
    return { questions: [], error: error.message };
  }

  // Transform tags data to match expected format
  const questions =
    data?.map((question: any) => ({
      ...question,
      tags: question.tags?.map((tagRelation: any) => tagRelation.tags) || [],
    })) || [];

  return { questions, error: null };
}

export async function unarchiveQuestion(
  questionId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerComponentClient({ cookies });

  try {
    const { error } = await supabase
      .from('questions')
      .update({ status: 'opened' })
      .eq('id', questionId);

    if (error) {
      console.error('unarchiveQuestion error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('unarchiveQuestion exception:', error);
    return { success: false, error: 'Wystąpił nieoczekiwany błąd' };
  }
}

export async function closeQuestion(
  questionId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerComponentClient({ cookies });

  try {
    const { error } = await supabase
      .from('questions')
      .update({ status: 'closed' })
      .eq('id', questionId);

    if (error) {
      console.error('closeQuestion error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('closeQuestion exception:', error);
    return { success: false, error: 'Wystąpił nieoczekiwany błąd' };
  }
}

export async function reopenQuestion(
  questionId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerComponentClient({ cookies });

  try {
    const { error } = await supabase
      .from('questions')
      .update({ status: 'opened' })
      .eq('id', questionId);

    if (error) {
      console.error('reopenQuestion error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('reopenQuestion exception:', error);
    return { success: false, error: 'Wystąpił nieoczekiwany błąd' };
  }
}

export async function archiveQuestion(
  questionId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerComponentClient({ cookies });

  try {
    const { error } = await supabase
      .from('questions')
      .update({ status: 'archived' })
      .eq('id', questionId);

    if (error) {
      console.error('archiveQuestion error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('archiveQuestion exception:', error);
    return { success: false, error: 'Wystąpił nieoczekiwany błąd' };
  }
}

export async function canEditQuestion(
  questionId: string,
  userId: string
): Promise<{ canEdit: boolean; reason?: string }> {
  const question = await getQuestionById(questionId);

  if (!question) {
    return { canEdit: false, reason: 'Pytanie nie istnieje' };
  }

  if (question.author.id !== userId) {
    return { canEdit: false, reason: 'Nie jesteś autorem tego pytania' };
  }

  if (question.status === 'archived') {
    return {
      canEdit: false,
      reason: 'Zarchiwizowanych pytań nie można edytować',
    };
  }

  if (question.status === 'closed') {
    return {
      canEdit: false,
      reason: 'Zamkniętych pytań nie można edytować',
    };
  }

  return { canEdit: true };
}

export async function getQuestionsByTag(
  tagId: string,
  limit: number = 3
): Promise<{
  questions: QuestionCardProps[];
  error: any;
}> {
  const supabase = createServerComponentClient({ cookies });

  try {
    // Pobierz ID pytań dla danego tagu
    const { data: questionTags, error: questionTagsError } = await supabase
      .from('question_tags')
      .select('question_id')
      .eq('tag_id', tagId);

    if (questionTagsError) throw questionTagsError;

    if (!questionTags || questionTags.length === 0) {
      return { questions: [], error: null };
    }

    const questionIds = questionTags.map((qt) => qt.question_id);

    // Pobierz pytania z autorami i tagami, posortowane według popularności
    const { data, error } = await supabase
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
      .in('id', questionIds)
      .order('likes_count', { ascending: false })
      .order('views_count', { ascending: false })
      .order('answers_count', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Przekształć dane do odpowiedniego formatu
    const formattedQuestions = (data || []).map((question) => ({
      ...question,
      tags: question.tags?.map((tagRelation: any) => tagRelation.tags) || [],
    }));

    return {
      questions: formattedQuestions as QuestionCardProps[],
      error: null,
    };
  } catch (error) {
    console.error('getQuestionsByTag error:', error);
    return { questions: [], error };
  }
}

export async function getQuestionsByTagWithFilters(
  tagId: string,
  {
    search,
    sort,
    filter,
    value,
  }: {
    search?: string;
    sort?: string;
    filter?: string;
    value?: string;
  } = {}
): Promise<{ questions: QuestionCardProps[]; error: any }> {
  const supabase = createServerComponentClient({ cookies });

  try {
    // Pobierz ID pytań dla danego tagu
    const { data: questionTags, error: questionTagsError } = await supabase
      .from('question_tags')
      .select('question_id')
      .eq('tag_id', tagId);

    if (questionTagsError) throw questionTagsError;

    if (!questionTags || questionTags.length === 0) {
      return { questions: [], error: null };
    }

    const questionIds = questionTags.map((qt) => qt.question_id);

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

    // Apply search filter
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    // Apply sorting
    if (sort === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sort === 'oldest') {
      query = query.order('created_at', { ascending: true });
    } else if (sort === 'answers') {
      query = query.order('answers_count', { ascending: false });
    } else if (sort === 'likes') {
      query = query.order('likes_count', { ascending: false });
    } else if (sort === 'views') {
      query = query.order('views_count', { ascending: false });
    } else if (sort === 'name') {
      query = query.order('title', { ascending: true });
    } else if (sort === 'status') {
      query = query.order('status', { ascending: true });
    } else {
      query = query.order('created_at', { ascending: false }); // domyślna
    }

    // Apply additional filters
    if (filter && value) {
      if (filter === 'user') {
        query = query.eq('author_id', value);
      } else if (filter === 'status') {
        query = query.eq('status', value);
      }
      // Note: tags filter is not needed here since we're already filtering by tag
    }

    const { data, error } = await query;

    if (error) throw error;

    // Przekształć dane do odpowiedniego formatu
    const formattedQuestions = (data || []).map((question) => ({
      ...question,
      tags: question.tags?.map((tagRelation: any) => tagRelation.tags) || [],
    }));

    return {
      questions: formattedQuestions as QuestionCardProps[],
      error: null,
    };
  } catch (error) {
    console.error('getQuestionsByTagWithFilters error:', error);
    return { questions: [], error };
  }
}

export async function getQuestionsByTagNameWithFilters(
  tagName: string,
  {
    search,
    sort,
    filter,
    value,
  }: {
    search?: string;
    sort?: string;
    filter?: string;
    value?: string;
  } = {}
): Promise<{ questions: QuestionCardProps[]; error: any }> {
  const supabase = createServerComponentClient({ cookies });

  try {
    // First get the tag by name
    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .select('id')
      .eq('name', tagName)
      .single();

    if (tagError || !tag) {
      return { questions: [], error: null };
    }

    // Pobierz ID pytań dla danego tagu
    const { data: questionTags, error: questionTagsError } = await supabase
      .from('question_tags')
      .select('question_id')
      .eq('tag_id', tag.id);

    if (questionTagsError) throw questionTagsError;

    if (!questionTags || questionTags.length === 0) {
      return { questions: [], error: null };
    }

    const questionIds = questionTags.map((qt) => qt.question_id);

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

    // Apply search filter
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    // Apply sorting
    if (sort === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sort === 'oldest') {
      query = query.order('created_at', { ascending: true });
    } else if (sort === 'answers') {
      query = query.order('answers_count', { ascending: false });
    } else if (sort === 'likes') {
      query = query.order('likes_count', { ascending: false });
    } else if (sort === 'views') {
      query = query.order('views_count', { ascending: false });
    } else if (sort === 'name') {
      query = query.order('title', { ascending: true });
    } else if (sort === 'status') {
      query = query.order('status', { ascending: true });
    } else {
      query = query.order('created_at', { ascending: false }); // domyślna
    }

    // Apply additional filters
    if (filter && value) {
      if (filter === 'user') {
        query = query.eq('author_id', value);
      } else if (filter === 'status') {
        query = query.eq('status', value);
      }
      // Note: tags filter is not needed here since we're already filtering by tag
    }

    const { data, error } = await query;

    if (error) throw error;

    // Przekształć dane do odpowiedniego formatu
    const formattedQuestions = (data || []).map((question) => ({
      ...question,
      tags: question.tags?.map((tagRelation: any) => tagRelation.tags) || [],
    }));

    return {
      questions: formattedQuestions as QuestionCardProps[],
      error: null,
    };
  } catch (error) {
    console.error('getQuestionsByTagNameWithFilters error:', error);
    return { questions: [], error };
  }
}

export async function deleteQuestionAction(
  questionId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerComponentClient({ cookies });

  try {
    // Sprawdź czy pytanie istnieje i pobierz dane autora
    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select(
        `
        id, 
        author_id,
        author:author_id (
          id,
          name,
          username,
          is_moderator
        )
      `
      )
      .eq('id', questionId)
      .single();

    if (questionError) {
      console.error('deleteQuestion - question not found:', questionError);
      return { success: false, error: 'Pytanie nie zostało znalezione' };
    }

    if (!question) {
      return { success: false, error: 'Pytanie nie zostało znalezione' };
    }

    // Sprawdź uprawnienia użytkownika
    const { data: userData, error: userCheckError } = await supabase
      .from('users')
      .select('is_moderator')
      .eq('id', userId)
      .single();

    if (userCheckError) {
      console.error('deleteQuestion - user check error:', userCheckError);
      return {
        success: false,
        error: 'Nie udało się sprawdzić uprawnień użytkownika',
      };
    }

    if (!userData) {
      return {
        success: false,
        error: 'Nie udało się pobrać danych użytkownika',
      };
    }

    // Sprawdź czy użytkownik może usunąć pytanie (autor lub administrator)
    const isAuthor = question.author_id === userId;
    const isAdmin = userData.is_moderator;

    if (!isAuthor && !isAdmin) {
      return {
        success: false,
        error: 'Nie masz uprawnień do usunięcia tego pytania',
      };
    }

    // Pobierz tagi powiązane z pytaniem i zmniejsz ich liczniki
    const { data: questionTags, error: tagsError } = await supabase
      .from('question_tags')
      .select('tag_id')
      .eq('question_id', questionId);

    if (tagsError) {
      console.error('Error fetching question tags:', tagsError);
      return {
        success: false,
        error: 'Nie udało się pobrać tagów pytania',
      };
    }

    // Zmniejsz liczniki dla wszystkich tagów
    if (questionTags && questionTags.length > 0) {
      for (const tagRelation of questionTags) {
        const { data: tagData, error: tagError } = await supabase
          .from('tags')
          .select('question_count')
          .eq('id', tagRelation.tag_id)
          .single();

        if (tagError) continue;

        const newCount = Math.max(0, (tagData.question_count || 0) - 1);
        await supabase
          .from('tags')
          .update({ question_count: newCount })
          .eq('id', tagRelation.tag_id);
      }
    }

    // Usuń pytanie (cascade usunie powiązane rekordy)
    const { error: deleteError } = await supabase
      .from('questions')
      .delete()
      .eq('id', questionId);

    if (deleteError) {
      console.error('deleteQuestion error:', deleteError);
      return {
        success: false,
        error: 'Wystąpił błąd podczas usuwania pytania',
      };
    }

    // Wyczyść puste tagi po usunięciu pytania
    await cleanupEmptyTags(supabase);

    return { success: true };
  } catch (error) {
    console.error('deleteQuestion exception:', error);
    return { success: false, error: 'Wystąpił nieoczekiwany błąd' };
  }
}

export async function getUnansweredQuestions(
  limit: number = 6
): Promise<QuestionCardProps[]> {
  const supabase = createServerComponentClient({ cookies });

  try {
    const { data, error } = await supabase
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
      .eq('answers_count', 0)
      .eq('status', 'opened')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Przekształć dane do odpowiedniego formatu
    const formattedQuestions = (data || []).map((question) => ({
      ...question,
      tags: question.tags?.map((tagRelation: any) => tagRelation.tags) || [],
    }));

    return formattedQuestions as QuestionCardProps[];
  } catch (error) {
    console.error('getUnansweredQuestions error:', error);
    return [];
  }
}

export async function getExpertQuestions(
  limit: number = 6
): Promise<QuestionCardProps[]> {
  const supabase = createServerComponentClient({ cookies });

  try {
    const { data, error } = await supabase
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
      .gte('author.reputation', 100) // Questions from users with reputation >= 100
      .eq('status', 'opened')
      .order('likes_count', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Przekształć dane do odpowiedniego formatu
    const formattedQuestions = (data || []).map((question) => ({
      ...question,
      tags: question.tags?.map((tagRelation: any) => tagRelation.tags) || [],
    }));

    return formattedQuestions as QuestionCardProps[];
  } catch (error) {
    console.error('getExpertQuestions error:', error);
    return [];
  }
}

export async function getHomepageStats(): Promise<{
  totalQuestions: number;
  totalUsers: number;
  totalAnswers: number;
  totalTags: number;
}> {
  const supabase = createServerComponentClient({ cookies });

  try {
    // Pobierz statystyki równolegle
    const [questionsResult, usersResult, answersResult, tagsResult] =
      await Promise.all([
        supabase.from('questions').select('id', { count: 'exact', head: true }),
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('answers').select('id', { count: 'exact', head: true }),
        supabase.from('tags').select('id', { count: 'exact', head: true }),
      ]);

    return {
      totalQuestions: questionsResult.count || 0,
      totalUsers: usersResult.count || 0,
      totalAnswers: answersResult.count || 0,
      totalTags: tagsResult.count || 0,
    };
  } catch (error) {
    console.error('getHomepageStats error:', error);
    return {
      totalQuestions: 0,
      totalUsers: 0,
      totalAnswers: 0,
      totalTags: 0,
    };
  }
}

// Voting functions
import { VoteType } from '@/types/vote.types';

export interface VoteQuestionParams {
  questionId: string;
  voteType: VoteType;
}

export interface VoteResult {
  success: boolean;
  error?: string;
  newLikesCount?: number;
  newDislikesCount?: number;
}

export async function voteQuestion({
  questionId,
  voteType,
}: VoteQuestionParams): Promise<VoteResult> {
  const supabase = createServerComponentClient({ cookies });

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Użytkownik nie jest zalogowany' };
    }

    // Check if user already voted on this question
    const { data: existingVote, error: fetchError } = await supabase
      .from('question_votes')
      .select('vote_type')
      .eq('question_id', questionId)
      .eq('user_id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching existing vote:', fetchError.message);
      return { success: false, error: fetchError.message };
    }

    const currentVote = existingVote?.vote_type;

    // Handle vote logic
    if (voteType === null) {
      // Remove vote
      if (currentVote) {
        const { error: deleteError } = await supabase
          .from('question_votes')
          .delete()
          .eq('question_id', questionId)
          .eq('user_id', user.id);

        if (deleteError) {
          console.error('Error deleting vote:', deleteError.message);
          return { success: false, error: deleteError.message };
        }

        // Update question counts
        const updateField =
          currentVote === 'liked' ? 'likes_count' : 'unlikes_count';

        // Get current count
        const { data: question, error: questionError } = await supabase
          .from('questions')
          .select(updateField)
          .eq('id', questionId)
          .single();

        if (questionError) {
          console.error(
            'Error fetching question count:',
            questionError.message
          );
          return { success: false, error: questionError.message };
        }

        // Update count
        const { error: updateError } = await supabase
          .from('questions')
          .update({
            [updateField]: Math.max(0, (question as any)[updateField] - 1),
          })
          .eq('id', questionId);

        if (updateError) {
          console.error('Error updating question count:', updateError.message);
          return { success: false, error: updateError.message };
        }
      }
    } else {
      // Add or update vote
      if (currentVote) {
        // Update existing vote
        const { error: updateError } = await supabase
          .from('question_votes')
          .update({
            vote_type: voteType,
            updated_at: new Date().toISOString(),
          })
          .eq('question_id', questionId)
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Error updating vote:', updateError.message);
          return { success: false, error: updateError.message };
        }

        // Update question counts - decrement old vote, increment new vote
        if (currentVote !== voteType) {
          const oldField =
            currentVote === 'liked' ? 'likes_count' : 'unlikes_count';
          const newField =
            voteType === 'liked' ? 'likes_count' : 'unlikes_count';

          // Get current counts
          const { data: question, error: questionError } = await supabase
            .from('questions')
            .select('likes_count, unlikes_count')
            .eq('id', questionId)
            .single();

          if (questionError) {
            console.error(
              'Error fetching question counts:',
              questionError.message
            );
            return { success: false, error: questionError.message };
          }

          // Update counts
          const { error: updateCountsError } = await supabase
            .from('questions')
            .update({
              [oldField]: Math.max(0, question[oldField] - 1),
              [newField]: question[newField] + 1,
            })
            .eq('id', questionId);

          if (updateCountsError) {
            console.error(
              'Error updating vote counts:',
              updateCountsError.message
            );
            return { success: false, error: updateCountsError.message };
          }
        }
      } else {
        // Insert new vote
        const { error: insertError } = await supabase
          .from('question_votes')
          .insert({
            question_id: questionId,
            user_id: user.id,
            vote_type: voteType,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (insertError) {
          console.error('Error inserting vote:', insertError.message);
          return { success: false, error: insertError.message };
        }

        // Update question count
        const updateField =
          voteType === 'liked' ? 'likes_count' : 'unlikes_count';

        // Get current count
        const { data: question, error: questionError } = await supabase
          .from('questions')
          .select(updateField)
          .eq('id', questionId)
          .single();

        if (questionError) {
          console.error(
            'Error fetching question count:',
            questionError.message
          );
          return { success: false, error: questionError.message };
        }

        // Update count
        const { error: updateError } = await supabase
          .from('questions')
          .update({
            [updateField]: (question as any)[updateField] + 1,
          })
          .eq('id', questionId);

        if (updateError) {
          console.error('Error updating question count:', updateError.message);
          return { success: false, error: updateError.message };
        }
      }
    }

    // Get updated counts
    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('likes_count, unlikes_count')
      .eq('id', questionId)
      .single();

    if (questionError) {
      console.error('Error fetching updated counts:', questionError.message);
      return { success: false, error: questionError.message };
    }

    return {
      success: true,
      newLikesCount: question.likes_count,
      newDislikesCount: question.unlikes_count,
    };
  } catch (error) {
    console.error('voteQuestion exception:', error);
    return { success: false, error: 'Wystąpił nieoczekiwany błąd' };
  }
}

export async function updateQuestion({
  id,
  title,
  content,
  short_content,
  tags,
  authorId,
}: {
  id: string;
  title: string;
  content: string;
  short_content: string;
  tags: string[];
  authorId: string;
}): Promise<{ success: boolean; questionSlug?: string; error?: string }> {
  const supabase = createServerComponentClient({ cookies });

  try {
    // Sprawdź czy pytanie istnieje i czy użytkownik ma uprawnienia
    const { data: questionCheck, error: checkError } = await supabase
      .from('questions')
      .select('status, author_id')
      .eq('id', id)
      .single();

    if (checkError) {
      console.error('Error checking question:', checkError);
      return {
        success: false,
        error: 'Nie udało się sprawdzić statusu pytania',
      };
    }

    if (questionCheck.status === 'archived') {
      return {
        success: false,
        error: 'Zarchiwizowanych pytań nie można edytować',
      };
    }

    if (questionCheck.status === 'closed') {
      return { success: false, error: 'Zamkniętych pytań nie można edytować' };
    }

    if (questionCheck.author_id !== authorId) {
      return {
        success: false,
        error: 'Nie masz uprawnień do edycji tego pytania',
      };
    }

    // Generuj unikalny slug
    let questionSlug: string;
    try {
      questionSlug = await generateUniqueSlugForUpdate(
        title,
        id,
        checkSlugExistsForUpdate
      );
    } catch (slugError) {
      console.error('Error generating slug:', slugError);
      return {
        success: false,
        error: 'Nie udało się wygenerować unikalnego adresu pytania',
      };
    }

    // Styluj kod w treści przed zapisaniem
    const highlightedContent = await highlightCodeInHTML(content);

    // Aktualizuj pytanie
    const { error: questionError } = await supabase
      .from('questions')
      .update({
        title,
        content: highlightedContent,
        short_content,
        question_slug: questionSlug,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (questionError) {
      console.error('Error updating question:', questionError);
      return { success: false, error: 'Nie udało się zaktualizować pytania' };
    }

    // Pobierz aktualne tagi
    const { data: currentTags, error: currentTagsError } = await supabase
      .from('question_tags')
      .select('tag_id')
      .eq('question_id', id);

    if (currentTagsError) {
      console.error('Error fetching current tags:', currentTagsError);
      return { success: false, error: 'Nie udało się pobrać aktualnych tagów' };
    }

    // Usuń wszystkie istniejące powiązania z tagami
    const { error: deleteTagsError } = await supabase
      .from('question_tags')
      .delete()
      .eq('question_id', id);

    if (deleteTagsError) {
      console.error('Error deleting tags:', deleteTagsError);
      return { success: false, error: 'Nie udało się usunąć starych tagów' };
    }

    // Zmniejsz liczniki dla usuniętych tagów
    const currentTagIds = currentTags?.map((tag) => tag.tag_id) || [];
    for (const tagId of currentTagIds) {
      const { data: tagData, error: tagError } = await supabase
        .from('tags')
        .select('question_count')
        .eq('id', tagId)
        .single();

      if (tagError) continue;

      const newCount = Math.max(0, (tagData.question_count || 0) - 1);
      await supabase
        .from('tags')
        .update({ question_count: newCount })
        .eq('id', tagId);
    }

    // Dodaj nowe tagi
    const tagIds: string[] = [];

    for (const tagName of tags) {
      const trimmed = tagName.trim().toLowerCase();

      const { data: existingTag, error: tagSelectError } = await supabase
        .from('tags')
        .select('id, question_count')
        .eq('name', trimmed)
        .single();

      if (tagSelectError && tagSelectError.code !== 'PGRST116') {
        console.error('Error selecting tag:', tagSelectError);
        return { success: false, error: 'Nie udało się sprawdzić tagu' };
      }

      let tagId: string;

      if (existingTag) {
        tagId = existingTag.id;

        const wasAlreadyAssigned = currentTagIds.includes(tagId);

        if (!wasAlreadyAssigned) {
          await supabase
            .from('tags')
            .update({ question_count: existingTag.question_count + 1 })
            .eq('id', tagId);
        }
      } else {
        const { data: newTag, error: tagInsertError } = await supabase
          .from('tags')
          .insert([{ name: trimmed, question_count: 1 }])
          .select()
          .single();

        if (tagInsertError) {
          console.error('Error inserting tag:', tagInsertError);
          return {
            success: false,
            error: 'Nie udało się utworzyć nowego tagu',
          };
        }

        tagId = newTag.id;
      }

      tagIds.push(tagId);
    }

    // Utwórz powiązania między pytaniem a tagami
    const tagLinks = tagIds.map((tagId) => ({
      question_id: id,
      tag_id: tagId,
    }));

    const { error: linkError } = await supabase
      .from('question_tags')
      .insert(tagLinks);

    if (linkError) {
      console.error('Error linking tags:', linkError);
      return {
        success: false,
        error: 'Nie udało się powiązać tagów z pytaniem',
      };
    }

    // Dodaj aktywność
    try {
      const { createActivity } = await import('@/services/server/activity');
      await createActivity({
        user_id: authorId,
        type: 'question',
        description: `Zaktualizował pytanie: "${title}"`,
        timestamp: new Date().toISOString(),
      });
    } catch (activityError) {
      console.error('Błąd dodawania aktywności:', activityError);
      // Nie przerywamy procesu jeśli aktywność się nie uda
    }

    // Wyczyść puste tagi po aktualizacji
    await cleanupEmptyTags(supabase);

    return { success: true, questionSlug };
  } catch (error) {
    console.error('Update question error:', error);
    return { success: false, error: 'Wystąpił błąd serwera' };
  }
}

export async function getUserVoteForQuestion(
  questionId: string
): Promise<VoteType> {
  const supabase = createServerComponentClient({ cookies });

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: vote, error } = await supabase
      .from('question_votes')
      .select('vote_type')
      .eq('question_id', questionId)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user vote:', error.message);
      return null;
    }

    return vote?.vote_type || null;
  } catch (error) {
    console.error('getUserVoteForQuestion exception:', error);
    return null;
  }
}
