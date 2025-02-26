'use client';

import { useEffect, useState } from 'react';
import InputField from '@/components/common/form/inputField';
import SubmitButton from '@/components/common/form/submitButton';
import { signIn } from '@/app/api/endpoints/auth';
import { useUserStore } from '@/stores/users';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    try {
      await signIn(email, password);
      useUserStore.getState().setIsLogin(true);
      router.push('/');
    } catch (error) {
      setMessage(`エラー: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (useUserStore.getState().getIsLogin()) {
      router.push('/');
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-geist">
      <h1 className="text-2xl font-bold mb-4">ログイン</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
        <InputField
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required={true}
        />
        <InputField
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={true}
        />
        <div className="mt-4 flex justify-center">
          <SubmitButton label="ログイン" disabled={isLoading} />
        </div>
      </form>

      {message && <p className="mt-4 text-sm text-center text-red-500">{message}</p>}
    </div>
  );
}
