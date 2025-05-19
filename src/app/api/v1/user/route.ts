// ユーザー情報取得API（GET /api/v1/user）
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  // クライアントからuserIdをクエリで受け取る例
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('id');
  if (!userId) {
    return new Response(JSON.stringify({ error: 'userId is required' }), { status: 400 });
  }
  // const userRepository = new UserRepository();
  try {
    // const user = await userRepository.getUserById(Number(userId));
    // if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    // }
    // return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    // ここでエラーハンドリングを行う
    // 例えば、500エラーを返すことができます。
    //   return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
