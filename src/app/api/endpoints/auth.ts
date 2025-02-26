import { supabaseClient } from '@/lib/supabase/supabaseClient';
import { signUp } from '@/app/api/helper/authHelper';

/**
 * Create a new user
 *
 * @see https://supabase.com/docs/reference/javascript/auth-signup
 * @param email
 * @param password
 * @param nickname
 */
export async function createUser(email: string, password: string, nickname: string) {
  const user = await signUp(email, password);
  if (user === null) throw new Error('User cannot be created');

  const { data, error } = await supabaseClient
    .from('Users')
    .insert([{ auth_id: user.id, nickname: nickname }]);

  if (error) {
    console.error('Error inserting user:', error);
    throw error;
  }
  return data;
}

/**
 * Sign in a user
 *
 * @see https://supabase.com/docs/reference/javascript/auth-signinwithpassword
 * @param email
 * @param password
 */
export async function signIn(email: string, password: string) {
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

/**
 * Sign out a user
 *
 * @see https://supabase.com/docs/reference/javascript/auth-signout
 */
export async function signOut() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

/**
 * Retrieve a session
 *
 * @see https://supabase.com/docs/reference/javascript/auth-getsession
 */
export async function getSession() {
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    throw error;
  }
  return data;
}

/**
 * Retrieve a user
 *
 * @see https://supabase.com/docs/reference/javascript/auth-getuser
 */
export async function getUser() {
  const { data } = await supabaseClient.auth.getUser();
  return data;
}
