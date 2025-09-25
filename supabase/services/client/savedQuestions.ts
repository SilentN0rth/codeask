'use client';

import { supabase } from 'supabase/supabaseClient';
import { QuestionCardProps } from '@/types/questions.types';

export async function saveQuestion(
  questionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Użytkownik nie jest zalogowany' };
    }

    const { error } = await supabase.from('saved_questions').insert([
      {
        user_id: user.id,
        question_id: questionId,
      },
    ]);

    if (error) {
      if (error.code === '23505') {
        // Unique constraint violation
        return { success: false, error: 'Pytanie jest już zapisane' };
      }
      console.error('saveQuestion error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('saveQuestion exception:', error);
    return { success: false, error: 'Wystąpił nieoczekiwany błąd' };
  }
}

export async function unsaveQuestion(
  questionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Użytkownik nie jest zalogowany' };
    }

    const { error } = await supabase
      .from('saved_questions')
      .delete()
      .eq('user_id', user.id)
      .eq('question_id', questionId);

    if (error) {
      console.error('unsaveQuestion error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('unsaveQuestion exception:', error);
    return { success: false, error: 'Wystąpił nieoczekiwany błąd' };
  }
}

export async function isQuestionSaved(questionId: string): Promise<boolean> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('saved_questions')
      .select('id')
      .eq('user_id', user.id)
      .eq('question_id', questionId);

    if (error) {
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    return false;
  }
}

export async function getSavedQuestionsClient({
  search,
  sort,
  filter,
  value,
}: {
  search?: string;
  sort?: string;
  filter?: string;
  value?: string;
} = {}): Promise<{
  questions: QuestionCardProps[];
  error: any;
}> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { questions: [], error: 'Użytkownik nie jest zalogowany' };
    }

    // Pobierz zapisane pytania dla zalogowanego użytkownika
    const { data, error } = await supabase
      .from('saved_questions')
      .select(
        `
        question_id,
        questions (
          *,
          author:author_id (*),
          tags:question_tags (
            tags (*)
          )
        )
      `
      )
      .eq('user_id', user.id);

    if (error) {
      console.error('getSavedQuestionsClient error:', error.message);
      return { questions: [], error: error.message };
    }

    // Przekształć dane do formatu QuestionCardProps
    let questions: QuestionCardProps[] =
      data?.map((item: any) => ({
        ...item.questions,
        tags:
          item.questions.tags?.map((tagRelation: any) => tagRelation.tags) ||
          [],
      })) || [];

    // Apply client-side filtering (search i filter)
    if (search) {
      questions = questions.filter((q) =>
        q.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter && value) {
      if (filter === 'tags') {
        questions = questions.filter((q) =>
          q.tags?.some((tag: any) => tag.id === value)
        );
      }
    }

    // Apply client-side sorting (identyczne z server-side)
    switch (sort) {
      case 'oldest':
        questions = questions.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case 'answers':
        questions = questions.sort(
          (a, b) => (b.answers_count || 0) - (a.answers_count || 0)
        );
        break;
      case 'likes':
        questions = questions.sort(
          (a, b) => (b.likes_count || 0) - (a.likes_count || 0)
        );
        break;
      case 'views':
        questions = questions.sort(
          (a, b) => (b.views_count || 0) - (a.views_count || 0)
        );
        break;
      case 'name':
        questions = questions.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'status':
        questions = questions.sort((a, b) => a.status.localeCompare(b.status));
        break;
      case 'newest':
      default:
        questions = questions.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    return { questions, error: null };
  } catch (error) {
    console.error('getSavedQuestionsClient exception:', error);
    return { questions: [], error: 'Wystąpił nieoczekiwany błąd' };
  }
}
