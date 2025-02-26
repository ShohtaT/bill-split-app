import { getSession, getUser } from '@/app/api/endpoints/auth';
import { supabaseClient } from '@/lib/supabase/supabaseClient';
import { User } from '@/types/user';

/**
 * Create a new user
 *
 * @see https://supabase.com/docs/reference/javascript/auth-signup
 * @param email
 * @param password
 * @return data of User
 */
export async function signUp(email: string, password: string) {
  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  if (error) throw error;
  return data.user;
}

/**
 * Retrieve a user as User
 *
 * @return data of User
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const uuid = await getCurrentUserUuid();

  const { data, error } = await supabaseClient.from('Users').select().eq('auth_id', uuid);
  if (error) {
    console.error('Error fetching user:', error);
    throw error;
  }

  return data[0] ?? null;
};

// @see https://qiita.com/megmogmog1965/items/37d7a4a3335f2758c861
const getCurrentUserUuid = async (): Promise<string | null> => {
  let uuid = null;
  const data = await getSession();
  if (data.session !== null) {
    const { user } = await getUser();
    if (user !== null) {
      uuid = user.id;
    } else {
      console.error('User not found');
      throw new Error('User not found');
    }
  }
  return uuid;
};
