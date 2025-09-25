'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Tag } from '@/types/tags.types';

export async function getTags({
  search,
  sort,
  status,
}: {
  search?: string;
  sort?: string;
  status?: string;
} = {}): Promise<{ tags: Tag[]; error: any }> {
  const supabase = createServerComponentClient({ cookies });

  let query = supabase.from('tags').select('*');

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  // Filter by status if provided
  if (status) {
    // Get question IDs with the specified status
    const { data: questionsWithStatus, error: questionsError } = await supabase
      .from('questions')
      .select('id')
      .eq('status', status);

    if (questionsError) throw questionsError;

    if (questionsWithStatus && questionsWithStatus.length > 0) {
      const questionIds = questionsWithStatus.map((q) => q.id);

      // Get tag IDs that are associated with these questions
      const { data: questionTags, error: questionTagsError } = await supabase
        .from('question_tags')
        .select('tag_id')
        .in('question_id', questionIds);

      if (questionTagsError) throw questionTagsError;

      if (questionTags && questionTags.length > 0) {
        const tagIds = [...new Set(questionTags.map((qt) => qt.tag_id))];
        query = query.in('id', tagIds);
      } else {
        // If no tags found, return empty result
        return { tags: [], error: null };
      }
    } else {
      // If no questions with this status, return empty result
      return { tags: [], error: null };
    }
  }

  switch (sort) {
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'oldest':
      query = query.order('created_at', { ascending: true });
      break;
    case 'name':
      query = query.order('name', { ascending: true });
      break;
    case 'popularity':
    default:
      query = query.order('question_count', { ascending: false });
      break;
  }

  const { data, error } = await query;

  if (error) throw error;

  return { tags: data as Tag[], error };
}

export async function getTagById(
  id: string
): Promise<{ tag: Tag | null; error: any }> {
  const supabase = createServerComponentClient({ cookies });

  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { tag: data as Tag, error: null };
  } catch (error) {
    console.error('getTagById error:', error);
    return { tag: null, error };
  }
}

export async function getPopularTags(limit: number = 8): Promise<Tag[]> {
  const supabase = createServerComponentClient({ cookies });

  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('question_count', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data as Tag[];
  } catch (error) {
    console.error('getPopularTags error:', error);
    return [];
  }
}

export async function getNewTags(limit: number = 8): Promise<Tag[]> {
  const supabase = createServerComponentClient({ cookies });

  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data as Tag[];
  } catch (error) {
    console.error('getNewTags error:', error);
    return [];
  }
}

export async function getTagByName(
  name: string
): Promise<{ tag: Tag | null; error: any }> {
  const supabase = createServerComponentClient({ cookies });

  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('name', name)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return { tag: data as Tag, error: null };
  } catch (error) {
    console.error('getTagByName error:', error);
    return { tag: null, error };
  }
}
