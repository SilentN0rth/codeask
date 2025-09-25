'use client';
import { Tag } from '@/types/tags.types';
import { supabase } from 'supabase/supabaseClient';

export const getTags = async (): Promise<{ tags: Tag[]; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('question_count', { ascending: false });

    if (error) {
      console.error('Błąd przy pobieraniu tagów:', error);
      return { tags: [], error };
    }

    return { tags: data || [], error: null };
  } catch (err) {
    console.error('Nieoczekiwany błąd przy pobieraniu tagów:', err);
    return { tags: [], error: err };
  }
};
