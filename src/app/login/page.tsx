'use client';

import { useEffect, useState } from 'react';
import InputField from '@/components/common/form/inputField';
import SubmitButton from '@/components/common/form/submitButton';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'usecase/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'ログインに失敗しました');
      }
      // ログイン状態はlocalStorage等で管理する場合はここで保存
      // localStorage.setItem('user', JSON.stringify(await res.json()));
      router.push('/');
      toast('ログインしました', { type: 'success' });
    } catch (error) {
      toast(`ログインに失敗しました\n${error}`, { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // ログイン状態の判定はlocalStorage等で行う場合はここで実装
  }, [router]);

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
    </div>
  );
}
