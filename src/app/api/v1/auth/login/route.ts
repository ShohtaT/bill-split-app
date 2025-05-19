import { NextRequest } from 'next/server';
import { supabaseClient } from '@/shared/lib/supabaseClient';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const { error, data } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 401 });
  }
  return new Response(JSON.stringify({ user: data.user }), { status: 200 });
}
