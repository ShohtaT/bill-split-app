import { NextRequest } from 'next/server';
import { supabaseClient } from '@/shared/lib/supabaseClient';

export async function POST(req: NextRequest) {
  const { email, password, nickname } = await req.json();

  // SignUp @ref https://supabase.com/docs/reference/javascript/auth-signup
  const { error: signUpError, data: signUpData } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: { nickname },
    },
  });
  if (signUpError || !signUpData.user) {
    return new Response(JSON.stringify({ error: signUpError?.message || 'Sign up failed' }), {
      status: 400,
    });
  }

  // Create User
  const { error: insertError } = await supabaseClient
    .from('Users')
    .insert([{ auth_id: signUpData.user.id, nickname, email }]);
  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ user: signUpData.user }), { status: 200 });
}
