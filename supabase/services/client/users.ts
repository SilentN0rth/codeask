import { UserInterface } from '@/types/users.types';
import { ActivityItem } from '@/types/activity.types';
import { supabase } from 'supabase/supabaseClient';
import { generateSlug } from '@/lib/utils/generateSlug';

export const getUserById = async (
  id: string
): Promise<UserInterface | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Błąd przy pobieraniu użytkownika:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Nieoczekiwany błąd przy pobieraniu użytkownika:', err);
    return null;
  }
};

export const getUserActivities = async (
  userId: string
): Promise<ActivityItem[]> => {
  try {
    const { data, error } = await supabase
      .from('activity_items')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Błąd przy pobieraniu aktywności:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Nieoczekiwany błąd przy pobieraniu aktywności:', err);
    return [];
  }
};

export const updateUserById = async (
  id: string,
  formData: Partial<UserInterface>
): Promise<{ error: any | null }> => {
  const { error } = await supabase
    .from('users')
    .update({
      ...formData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  return { error };
};

export const getUsers = async (): Promise<UserInterface[]> => {
  try {
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
      console.error('Błąd przy pobieraniu użytkowników:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Nieoczekiwany błąd przy pobieraniu użytkowników:', err);
    return [];
  }
};
