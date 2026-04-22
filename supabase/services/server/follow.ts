import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { UserInterface } from '@/types/users.types';
import { SortUserOption } from '@/types/searchAndFilters.types';
import { getCurrentUserId } from './users';

export async function getFollowersWithFollowStatus({
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

  // Pobierz aktualnego użytkownika używając gotowej funkcji
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    return { users: [], followStatuses: {} };
  }

  // Pobierz obserwujących użytkowników
  const query = supabase
    .from('follows')
    .select(
      `
      follower_id,
      users!follower_id (*)
    `
    )
    .eq('following_id', currentUserId)
    .order('followed_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching followers:', error);
    return { users: [], followStatuses: {} };
  }

  const users =
    (data
      ?.map((follow) => follow.users)
      .filter(Boolean) as unknown as UserInterface[]) || [];

  // Filtrowanie po wyszukiwaniu
  let filteredUsers = users;
  if (search) {
    const searchLower = search.toLowerCase();
    filteredUsers = users.filter(
      (user) =>
        user.username?.toLowerCase().includes(searchLower) ||
        user.name?.toLowerCase().includes(searchLower)
    );
  }

  // Sortowanie
  if (sort) {
    switch (sort) {
      case 'newest':
        filteredUsers.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case 'oldest':
        filteredUsers.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case 'mostQuestions':
        filteredUsers.sort(
          (a, b) => (b.questions_count || 0) - (a.questions_count || 0)
        );
        break;
      case 'mostAnswers':
        filteredUsers.sort(
          (a, b) => (b.answers_count || 0) - (a.answers_count || 0)
        );
        break;
      case 'mostReputation':
        filteredUsers.sort((a, b) => (b.reputation || 0) - (a.reputation || 0));
        break;
      case 'name':
        filteredUsers.sort((a, b) =>
          (a.name || a.username || '').localeCompare(b.name || b.username || '')
        );
        break;
    }
  }

  // Pobierz statusy follow dla wszystkich użytkowników jednorazowo
  const userIds = filteredUsers.map((user) => user.id);
  const { data: follows, error: followError } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', currentUserId)
    .in('following_id', userIds);

  if (followError) {
    console.error('Error fetching follow statuses:', followError);
    return { users: filteredUsers, followStatuses: {} };
  }

  // Stwórz mapę statusów follow
  const followStatuses: Record<string, boolean> = {};
  follows?.forEach((follow) => {
    followStatuses[follow.following_id] = true;
  });

  return { users: filteredUsers, followStatuses };
}

export async function getFollowingWithFollowStatus({
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

  // Pobierz aktualnego użytkownika używając gotowej funkcji
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    return { users: [], followStatuses: {} };
  }

  // Pobierz obserwowanych użytkowników
  const query = supabase
    .from('follows')
    .select(
      `
      following_id,
      users!following_id (*)
    `
    )
    .eq('follower_id', currentUserId)
    .order('followed_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching following:', error);
    return { users: [], followStatuses: {} };
  }

  const users =
    (data
      ?.map((follow) => follow.users)
      .filter(Boolean) as unknown as UserInterface[]) || [];

  // Filtrowanie po wyszukiwaniu
  let filteredUsers = users;
  if (search) {
    const searchLower = search.toLowerCase();
    filteredUsers = users.filter(
      (user) =>
        user.username?.toLowerCase().includes(searchLower) ||
        user.name?.toLowerCase().includes(searchLower)
    );
  }

  // Sortowanie
  if (sort) {
    switch (sort) {
      case 'newest':
        filteredUsers.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case 'oldest':
        filteredUsers.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case 'mostQuestions':
        filteredUsers.sort(
          (a, b) => (b.questions_count || 0) - (a.questions_count || 0)
        );
        break;
      case 'mostAnswers':
        filteredUsers.sort(
          (a, b) => (b.answers_count || 0) - (a.answers_count || 0)
        );
        break;
      case 'mostReputation':
        filteredUsers.sort((a, b) => (b.reputation || 0) - (a.reputation || 0));
        break;
      case 'name':
        filteredUsers.sort((a, b) =>
          (a.name || a.username || '').localeCompare(b.name || b.username || '')
        );
        break;
    }
  }

  // Pobierz statusy follow dla wszystkich użytkowników jednorazowo
  const userIds = filteredUsers.map((user) => user.id);
  const { data: follows, error: followError } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', currentUserId)
    .in('following_id', userIds);

  if (followError) {
    console.error('Error fetching follow statuses:', followError);
    return { users: filteredUsers, followStatuses: {} };
  }

  // Stwórz mapę statusów follow
  const followStatuses: Record<string, boolean> = {};
  follows?.forEach((follow) => {
    followStatuses[follow.following_id] = true;
  });

  return { users: filteredUsers, followStatuses };
}
