import { User } from '@/types/user';
import { supabaseClient } from '@/lib/supabase/supabaseClient';

/**
 * Retrieve User
 *
 * @param userId number
 * @return data of User
 */
export async function getUserByUserIdToSupabase(userId: number): Promise<User | null> {
  const { data, error } = await supabaseClient.from('Users').select().eq('id', userId).single();
  if (error) {
    console.error('Error fetching user:', error);
    throw error;
  }

  return data ?? null;
}
