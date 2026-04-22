'use server';
/* eslint-disable camelcase */
import {
  generateSlug,
  generateUniqueSlug,
  generateUniqueSlugForUpdate,
} from '@/lib/utils/generateSlug';
import type { User } from '@supabase/supabase-js';
import { createActivity } from './activity';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { checkAndAwardBadges } from './badges';

import { supabase } from 'supabase/supabaseClient';
import { UserInterface } from '@/types/users.types';

import { SortUserOption } from '@/types/searchAndFilters.types';

export async function createUserProfile(user: User) {
  const baseName = user.email?.split('@')[0] || 'user';
  const username = baseName.toLowerCase();

  // Generuj unikalny slug na podstawie username (nie name)
  const profileSlug = await generateUniqueSlug(username, checkUserSlugExists);

  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert([
      {
        id: user.id,
        name: baseName,
        email: user.email,
        username,
        profile_slug: profileSlug,
        avatar_url: '',
        background_url: '',
        bio: null,
        specialization: '',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at ?? null,
        updated_at: user.updated_at,
        confirmed_at: user.confirmed_at,

        answers_count: 0,
        questions_count: 0,
        reputation: 0,

        badges: {
          gold: 0,
          silver: 0,
          bronze: 0,
          first_question: false,
          first_answer: false,
          helpful_answer: false,
          popular_question: false,
          active_user: false,
          expert: false,
          community_companion: false,
          community_helper: false,
        },

        is_moderator: false,
        permissions: [],

        following_count: 0,
        followers_count: 0,

        website_url: null,
        twitter_url: null,
        github_url: null,
        location: null,
        is_online: true, // Użytkownik jest online podczas rejestracji
      },
    ]);

  if (userError) throw userError;

  try {
    await createActivity({
      user_id: user.id,
      type: 'joined',
      description: 'Dołączył do platformy.',
      timestamp: user.created_at,
    });
  } catch (activityError) {
    console.error('Błąd dodawania aktywności:', activityError);
    throw activityError;
  }

  return userData;
}

export async function getCurrentUserId(): Promise<string | null> {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    return null;
  }

  return session.user.id;
}

export async function getCurrentUser(): Promise<UserInterface | null> {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) return null;

  const { user } = session;

  // Pobieramy pełne dane użytkownika z tabeli `users`
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !data) return null;

  return data as UserInterface;
}

export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select(
      `
            *,
            recent_activity:activity_items!user_id (
                id,
                type,
                description,
                timestamp
            )
        `
    )
    .eq('id', id)
    .single();

  if (error) {
    console.error('getUserById error:', error.message);
    return null;
  }

  if (!data) {
    console.warn('getUserById: no user found for id', id);
    return null;
  }

  // Sortuj aktywności po dacie (najnowsze pierwsze)
  if (data.recent_activity) {
    data.recent_activity.sort((a: any, b: any) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return dateB.getTime() - dateA.getTime();
    });
  }

  return data;
}

export async function getUserBySlug(slug: string) {
  const { data, error } = await supabase
    .from('users')
    .select(
      `
            *,
            recent_activity:activity_items!user_id (
                id,
                type,
                description,
                timestamp
            )
        `
    )
    .eq('profile_slug', slug)
    .single();

  if (error) {
    console.error('getUserBySlug error:', error.message);
    return null;
  }

  if (!data) {
    console.warn('getUserBySlug: no user found for slug', slug);
    return null;
  }

  // Sortuj aktywności po dacie (najnowsze pierwsze)
  if (data.recent_activity) {
    data.recent_activity.sort((a: any, b: any) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return dateB.getTime() - dateA.getTime();
    });
  }

  return data;
}

export async function checkUserSlugExists(slug: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('profile_slug', slug)
    .single();

  if (error && error.code === 'PGRST116') {
    // No rows found - slug doesn't exist
    return false;
  }

  if (error) {
    console.error('checkUserSlugExists error:', error.message);
    return false;
  }

  // If we get data, slug exists
  return !!data;
}

export async function checkUserSlugExistsForUpdate(
  slug: string,
  excludeId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('profile_slug', slug)
    .neq('id', excludeId) // Wyklucz aktualnego użytkownika
    .single();

  if (error && error.code === 'PGRST116') {
    // No rows found - slug doesn't exist
    return false;
  }

  if (error) {
    console.error('checkUserSlugExistsForUpdate error:', error.message);
    return false;
  }

  // If we get data, slug exists
  return !!data;
}

export async function getUsers({
  search,
  sort,
  limit = 100,
}: {
  search?: string;
  sort?: SortUserOption;
  limit?: number;
} = {}): Promise<UserInterface[]> {
  const supabase = createServerComponentClient({ cookies });

  let query = supabase.from('users').select('*');

  // SEARCH
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  // SORT
  switch (sort) {
    case 'oldest':
      query = query.order('created_at', { ascending: true });
      break;
    case 'mostAnswers':
      query = query.order('answers_count', { ascending: false });
      break;
    case 'mostReputation':
      query = query.order('reputation', { ascending: false });
      break;
    case 'mostQuestions':
      query = query.order('questions_count', { ascending: false });
      break;
    case 'name':
      query = query.order('name', { ascending: true });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  // LIMIT
  query = query.limit(limit);

  const { data, error } = await query;

  if (error) throw error;

  return data || [];
}

export async function getUsersWithFollowStatus({
  search,
  sort,
}: {
  search?: string;
  sort?: SortUserOption;
} = {}): Promise<{
  users: UserInterface[];
  followStatuses: Record<string, boolean>;
}> {
  const supabase = createServerComponentClient({ cookies });

  // Pobierz aktualnego użytkownika
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const currentUserId = session?.user?.id;

  // Pobierz użytkowników
  const users = await getUsers({ search, sort });

  // Jeśli nie ma zalogowanego użytkownika, zwróć tylko użytkowników
  if (!currentUserId) {
    return { users, followStatuses: {} };
  }

  // Pobierz statusy follow dla wszystkich użytkowników jednorazowo
  const userIds = users.map((user) => user.id);
  const { data: follows, error } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', currentUserId)
    .in('following_id', userIds);

  if (error) {
    console.error('Error fetching follow statuses:', error);
    return { users, followStatuses: {} };
  }

  // Stwórz mapę statusów follow
  const followStatuses: Record<string, boolean> = {};
  follows?.forEach((follow) => {
    followStatuses[follow.following_id] = true;
  });

  return { users, followStatuses };
}

export async function getNewUsers(limit: number = 5): Promise<UserInterface[]> {
  const supabase = createServerComponentClient({ cookies });

  // Pobierz użytkowników zarejestrowanych w ostatnich 30 dniach
  // którzy mają przynajmniej 1 pytanie LUB 1 odpowiedź
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .gte('created_at', thirtyDaysAgo.toISOString())
    .or('answers_count.gt.0')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return data || [];
}

export async function getTopUsers(limit: number = 3): Promise<UserInterface[]> {
  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('reputation', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return data || [];
}

export async function getRecentlyHelpedUsers(limit: number = 6): Promise<{
  helpedData: Array<{
    user: UserInterface;
    question: any;
    answeredAt: string;
  }>;
}> {
  const supabase = createServerComponentClient({ cookies });

  // Get recent answers with user and question data
  const { data: recentAnswers, error: answersError } = await supabase
    .from('answers')
    .select(
      `
      id,
      created_at,
      author_id,
      question_id,
      users:author_id (
        id,
        name,
        username,
        avatar_url,
        reputation,
        answers_count
      ),
      questions:question_id (
        id,
        title,
        question_slug,
        created_at,
        answers_count,
        views_count,
        author_id,
        author:author_id (
          id,
          name,
          username
        )
      )
    `
    )
    .order('created_at', { ascending: false })
    .limit(limit * 2); // Get more to filter out own questions

  if (answersError) {
    console.error('getRecentlyHelpedUsers error:', answersError.message);
    return { helpedData: [] };
  }

  if (!recentAnswers || recentAnswers.length === 0) {
    return { helpedData: [] };
  }

  // Filter out answers to own questions and create the data structure
  const helpedData = recentAnswers
    .filter(
      (answer: any) =>
        answer.users &&
        answer.questions &&
        answer.users.id !== answer.questions.author_id // Not answering own question
    )
    .slice(0, limit)
    .map((answer: any) => ({
      user: answer.users,
      question: answer.questions,
      answeredAt: answer.created_at,
    }));

  return { helpedData };
}

// ============================================================================
// REPUTATION MANAGEMENT
// ============================================================================

export async function updateUserReputation(
  userId: string,
  reputationChange: number
): Promise<boolean> {
  try {
    // Get current reputation
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('reputation')
      .eq('id', userId)
      .single();

    if (fetchError || !user) {
      console.error('Error fetching user reputation:', fetchError);
      return false;
    }

    const newReputation = Math.max(
      0,
      (user.reputation || 0) + reputationChange
    );

    // Update reputation
    const { error: updateError } = await supabase
      .from('users')
      .update({
        reputation: newReputation,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating reputation:', updateError);
      return false;
    }

    // Check reputation badges
    try {
      await checkAndAwardBadges(userId, 'reputation_changed');
    } catch (badgeError) {
      console.error('Error checking reputation badges:', badgeError);
    }

    return true;
  } catch (error) {
    console.error('Error in updateUserReputation:', error);
    return false;
  }
}

export async function updateUserProfile(
  userId: string,
  formData: Partial<UserInterface>
): Promise<{ error: any | null; updatedUser?: UserInterface }> {
  try {
    // Jeśli zmienia się username, wygeneruj nowy slug
    if (formData.username && formData.username !== '') {
      const newSlug = await generateUniqueSlugForUpdate(
        formData.username,
        userId,
        checkUserSlugExistsForUpdate
      );
      formData.profile_slug = newSlug;
    }

    const { data, error } = await supabase
      .from('users')
      .update({
        ...formData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return { error };
    }

    return { error: null, updatedUser: data };
  } catch (err) {
    console.error('Unexpected error updating user profile:', err);
    return { error: err };
  }
}
