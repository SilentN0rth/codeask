import { UserInterface } from '@/types/users.types';
import { SortUserOption } from '@/types/searchAndFilters.types';
import { supabase } from 'supabase/supabaseClient';
import { checkAndAwardBadges } from '@/services/server/badges';

export async function isFollowing(
  followerId: string,
  followingId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('follows')
    .select('*', { count: 'exact' })
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .limit(1);

  if (error) {
    console.error('isFollowing error:', error);
    return false;
  }
  return (data?.length ?? 0) > 0;
}

async function updateFollowingCount(
  userId: string,
  delta: number
): Promise<boolean> {
  // Pobierz aktualny following_count
  const { data, error } = await supabase
    .from('users')
    .select('following_count')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error('updateFollowingCount fetch error:', error);
    return false;
  }

  const newCount = Math.max(0, (data.following_count ?? 0) + delta);

  // Zaktualizuj wartość w bazie
  const { error: updateError } = await supabase
    .from('users')
    .update({ following_count: newCount })
    .eq('id', userId);

  if (updateError) {
    console.error('updateFollowingCount update error:', updateError);
    return false;
  }

  return true;
}

async function updateFollowersCount(
  userId: string,
  delta: number
): Promise<boolean> {
  // Pobierz aktualny followers_count
  const { data, error } = await supabase
    .from('users')
    .select('followers_count')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error('updateFollowersCount fetch error:', error);
    return false;
  }

  const newCount = Math.max(0, (data.followers_count ?? 0) + delta);

  // Zaktualizuj wartość w bazie
  const { error: updateError } = await supabase
    .from('users')
    .update({ followers_count: newCount })
    .eq('id', userId);

  if (updateError) {
    console.error('updateFollowersCount update error:', updateError);
    return false;
  }

  return true;
}

export async function followUser(
  followerId: string,
  followingId: string
): Promise<UserInterface | null> {
  // Insert follow record
  const { error: insertError } = await supabase.from('follows').insert({
    follower_id: followerId,
    following_id: followingId,
  });

  if (insertError) {
    console.error('followUser insert error:', insertError);
    return null;
  }

  // Get both counts in one request
  const { data: usersData, error: fetchError } = await supabase
    .from('users')
    .select('id, following_count, followers_count')
    .in('id', [followerId, followingId]);

  if (fetchError || !usersData || usersData.length !== 2) {
    console.error('Error fetching user counts:', fetchError);
    return null;
  }

  const followerData = usersData.find((u) => u.id === followerId);
  const followingData = usersData.find((u) => u.id === followingId);

  if (!followerData || !followingData) {
    console.error('Could not find user data');
    return null;
  }

  // Update both counts in parallel
  const [followingUpdate, followersUpdate] = await Promise.all([
    supabase
      .from('users')
      .update({ following_count: (followerData.following_count || 0) + 1 })
      .eq('id', followerId),
    supabase
      .from('users')
      .update({ followers_count: (followingData.followers_count || 0) + 1 })
      .eq('id', followingId),
  ]);

  if (followingUpdate.error || followersUpdate.error) {
    console.error(
      'Error updating counts:',
      followingUpdate.error || followersUpdate.error
    );
    return null;
  }

  // Sprawdź odznaki dla obu użytkowników po follow
  try {
    // Sprawdź odznaki dla użytkownika który obserwuje (może dostać community_companion)
    await checkAndAwardBadges(followerId, 'user_followed');

    // Sprawdź odznaki dla użytkownika który jest obserwowany (może dostać community_companion)
    await checkAndAwardBadges(followingId, 'user_followed');
  } catch (badgeError) {
    console.error('❌ Błąd sprawdzania odznak:', badgeError);
  }

  return { id: followingId } as UserInterface;
}

export async function unfollowUser(
  followerId: string,
  followingId: string
): Promise<UserInterface | null> {
  const { error: deleteError } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId);

  if (deleteError) {
    console.error('unfollowUser delete error:', deleteError);
    return null;
  }

  // Get both counts in one request
  const { data: usersData, error: fetchError } = await supabase
    .from('users')
    .select('id, following_count, followers_count')
    .in('id', [followerId, followingId]);

  if (fetchError || !usersData || usersData.length !== 2) {
    console.error('Error fetching user counts:', fetchError);
    return null;
  }

  const followerData = usersData.find((u) => u.id === followerId);
  const followingData = usersData.find((u) => u.id === followingId);

  if (!followerData || !followingData) {
    console.error('Could not find user data');
    return null;
  }

  // Update both counts in parallel
  const [followingUpdate, followersUpdate] = await Promise.all([
    supabase
      .from('users')
      .update({
        following_count: Math.max(0, (followerData.following_count || 0) - 1),
      })
      .eq('id', followerId),
    supabase
      .from('users')
      .update({
        followers_count: Math.max(0, (followingData.followers_count || 0) - 1),
      })
      .eq('id', followingId),
  ]);

  if (followingUpdate.error || followersUpdate.error) {
    console.error(
      'Error updating counts:',
      followingUpdate.error || followersUpdate.error
    );
    return null;
  }

  return { id: followingId } as UserInterface;
}

/**
 * Sprawdza czy aktualny użytkownik obserwuje danego użytkownika
 * Zawiera debug logi dla łatwiejszego debugowania
 */
export async function checkUserFollowStatus(
  currentUserId: string,
  targetUserId: string
): Promise<boolean> {
  try {
    const isCurrentlyFollowing = await isFollowing(currentUserId, targetUserId);

    return isCurrentlyFollowing;
  } catch (error) {
    console.error('Błąd podczas sprawdzania statusu obserwowania:', error);
    return false;
  }
}

/**
 * Pobiera użytkowników obserwowanych przez danego użytkownika
 */
export async function getFollowedUsers(
  userId: string
): Promise<UserInterface[]> {
  try {
    // First, let's check if there are any follows for this user
    const { data: countData, error: countError } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', userId);

    const { data, error } = await supabase
      .from('follows')
      .select(
        `
        following_id,
        users!following_id (*)
      `
      )
      .eq('follower_id', userId)
      .order('followed_at', { ascending: false });

    if (error) {
      console.error(
        'Błąd podczas pobierania obserwowanych użytkowników:',
        error
      );
      return [];
    }

    const users =
      (data
        ?.map((follow) => follow.users)
        .filter(Boolean) as unknown as UserInterface[]) || [];

    return users;
  } catch (error) {
    console.error('Błąd podczas pobierania obserwowanych użytkowników:', error);
    return [];
  }
}

/**
 * Pobiera użytkowników którzy obserwują danego użytkownika
 */
export async function getFollowersUsers(
  userId: string
): Promise<UserInterface[]> {
  try {
    // First, let's check if there are any followers for this user
    const { data: countData, error: countError } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', userId);

    const { data, error } = await supabase
      .from('follows')
      .select(
        `
        follower_id,
        users!follower_id (*)
      `
      )
      .eq('following_id', userId)
      .order('followed_at', { ascending: false });

    if (error) {
      console.error(
        'Błąd podczas pobierania obserwujących użytkowników:',
        error
      );
      return [];
    }

    const users =
      (data
        ?.map((follow) => follow.users)
        .filter(Boolean) as unknown as UserInterface[]) || [];

    return users;
  } catch (error) {
    console.error('Błąd podczas pobierania obserwujących użytkowników:', error);
    return [];
  }
}

/**
 * Pobiera użytkowników obserwowanych przez danego użytkownika z filtrowaniem
 */
export async function getFollowedUsersWithFilters(
  userId: string,
  search?: string,
  sort?: string
): Promise<UserInterface[]> {
  try {
    let query = supabase
      .from('follows')
      .select(
        `
        following_id,
        users!following_id (*)
      `
      )
      .eq('follower_id', userId);

    // Dodaj sortowanie
    switch (sort) {
      case 'oldest':
        query = query.order('followed_at', { ascending: true });
        break;
      case 'name':
        query = query.order('followed_at', { ascending: false }); // Sortowanie po nazwie będzie po stronie klienta
        break;
      case 'newest':
      default:
        query = query.order('followed_at', { ascending: false });
        break;
    }

    const { data, error } = await query;

    if (error) {
      console.error(
        'Błąd podczas pobierania obserwowanych użytkowników z filtrami:',
        error
      );
      return [];
    }

    let users =
      (data
        ?.map((follow) => follow.users)
        .filter(Boolean) as unknown as UserInterface[]) || [];

    // Filtrowanie po stronie klienta (bo Supabase nie obsługuje ilike na joined tables)
    if (search) {
      users = users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sortowanie po nazwie po stronie klienta
    if (sort === 'name') {
      users.sort((a, b) => a.name.localeCompare(b.name));
    }

    return users;
  } catch (error) {
    console.error(
      'Błąd podczas pobierania obserwowanych użytkowników z filtrami:',
      error
    );
    return [];
  }
}

/**
 * Pobiera użytkowników którzy obserwują danego użytkownika z filtrowaniem
 */
export async function getFollowersUsersWithFilters(
  userId: string,
  search?: string,
  sort?: string
): Promise<UserInterface[]> {
  try {
    let query = supabase
      .from('follows')
      .select(
        `
        follower_id,
        users!follower_id (*)
      `
      )
      .eq('following_id', userId);

    // Dodaj sortowanie
    switch (sort) {
      case 'oldest':
        query = query.order('followed_at', { ascending: true });
        break;
      case 'name':
        query = query.order('followed_at', { ascending: false }); // Sortowanie po nazwie będzie po stronie klienta
        break;
      case 'newest':
      default:
        query = query.order('followed_at', { ascending: false });
        break;
    }

    const { data, error } = await query;

    if (error) {
      console.error(
        'Błąd podczas pobierania obserwujących użytkowników z filtrami:',
        error
      );
      return [];
    }

    let users =
      (data
        ?.map((follow) => follow.users)
        .filter(Boolean) as unknown as UserInterface[]) || [];

    // Filtrowanie po stronie klienta (bo Supabase nie obsługuje ilike na joined tables)
    if (search) {
      users = users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sortowanie po nazwie po stronie klienta
    if (sort === 'name') {
      users.sort((a, b) => a.name.localeCompare(b.name));
    }

    return users;
  } catch (error) {
    console.error(
      'Błąd podczas pobierania obserwujących użytkowników z filtrami:',
      error
    );
    return [];
  }
}

/**
 * Pobiera obserwujących użytkowników z statusami follow (dla strony followers)
 */
export async function getFollowersWithFollowStatusClient({
  search,
  sort,
}: {
  search?: string;
  sort?: SortUserOption;
} = {}): Promise<{
  users: UserInterface[];
  followStatuses: Record<string, boolean>;
}> {
  try {
    // Pobierz aktualnego użytkownika
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { users: [], followStatuses: {} };
    }

    const currentUserId = user.id;

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

    let users =
      (data
        ?.map((follow) => follow.users)
        .filter(Boolean) as unknown as UserInterface[]) || [];

    // Filtrowanie po wyszukiwaniu
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(
        (user) =>
          user.username?.toLowerCase().includes(searchLower) ||
          user.name?.toLowerCase().includes(searchLower)
      );
    }

    // Sortowanie
    if (sort) {
      switch (sort) {
        case 'newest':
          users.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
          break;
        case 'oldest':
          users.sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          );
          break;
        case 'mostQuestions':
          users.sort(
            (a, b) => (b.questions_count || 0) - (a.questions_count || 0)
          );
          break;
        case 'mostAnswers':
          users.sort((a, b) => (b.answers_count || 0) - (a.answers_count || 0));
          break;
        case 'mostReputation':
          users.sort((a, b) => (b.reputation || 0) - (a.reputation || 0));
          break;
        case 'name':
          users.sort((a, b) =>
            (a.name || a.username || '').localeCompare(
              b.name || b.username || ''
            )
          );
          break;
      }
    }

    // Pobierz statusy follow dla wszystkich użytkowników jednorazowo
    const userIds = users.map((user) => user.id);
    const { data: follows, error: followError } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', currentUserId)
      .in('following_id', userIds);

    if (followError) {
      console.error('Error fetching follow statuses:', followError);
      return { users, followStatuses: {} };
    }

    // Stwórz mapę statusów follow
    const followStatuses: Record<string, boolean> = {};
    follows?.forEach((follow) => {
      followStatuses[follow.following_id] = true;
    });

    return { users, followStatuses };
  } catch (error) {
    console.error('getFollowersWithFollowStatusClient error:', error);
    return { users: [], followStatuses: {} };
  }
}

/**
 * Pobiera obserwowanych użytkowników z statusami follow (dla strony following)
 */
export async function getFollowingWithFollowStatusClient({
  search,
  sort,
}: {
  search?: string;
  sort?: SortUserOption;
} = {}): Promise<{
  users: UserInterface[];
  followStatuses: Record<string, boolean>;
}> {
  try {
    // Pobierz aktualnego użytkownika
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { users: [], followStatuses: {} };
    }

    const currentUserId = user.id;

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

    let users =
      (data
        ?.map((follow) => follow.users)
        .filter(Boolean) as unknown as UserInterface[]) || [];

    // Filtrowanie po wyszukiwaniu
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(
        (user) =>
          user.username?.toLowerCase().includes(searchLower) ||
          user.name?.toLowerCase().includes(searchLower)
      );
    }

    // Sortowanie
    if (sort) {
      switch (sort) {
        case 'newest':
          users.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
          break;
        case 'oldest':
          users.sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          );
          break;
        case 'mostQuestions':
          users.sort(
            (a, b) => (b.questions_count || 0) - (a.questions_count || 0)
          );
          break;
        case 'mostAnswers':
          users.sort((a, b) => (b.answers_count || 0) - (a.answers_count || 0));
          break;
        case 'mostReputation':
          users.sort((a, b) => (b.reputation || 0) - (a.reputation || 0));
          break;
        case 'name':
          users.sort((a, b) =>
            (a.name || a.username || '').localeCompare(
              b.name || b.username || ''
            )
          );
          break;
      }
    }

    // Pobierz statusy follow dla wszystkich użytkowników jednorazowo
    const userIds = users.map((user) => user.id);
    const { data: follows, error: followError } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', currentUserId)
      .in('following_id', userIds);

    if (followError) {
      console.error('Error fetching follow statuses:', followError);
      return { users, followStatuses: {} };
    }

    // Stwórz mapę statusów follow
    const followStatuses: Record<string, boolean> = {};
    follows?.forEach((follow) => {
      followStatuses[follow.following_id] = true;
    });

    return { users, followStatuses };
  } catch (error) {
    console.error('getFollowingWithFollowStatusClient error:', error);
    return { users: [], followStatuses: {} };
  }
}
