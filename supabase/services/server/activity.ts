'use server';
import { ActivityItem } from '@/types/activity.types';
import { supabase } from '../../supabaseClient';
export async function createActivity(activity: ActivityItem) {
  const { error } = await supabase.from('activity_items').insert([activity]);
  if (error) throw error;
}
