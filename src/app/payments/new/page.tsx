'use client';

import { useEffect, useState } from 'react';
import InputField from '@/components/common/form/inputField';
import SubmitButton from '@/components/common/form/submitButton';
import Textarea from '@/components/common/form/textarea';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';
import BillingsForm from '@/app/payments/new/billingsForm';
import { createPayment } from '@/app/api/endpoints/payments';
import { Billing } from '@/types/payment';
import { getUsersList } from '@/app/api/endpoints/user';

export default function Page() {
  const router = useRouter();

  // 送信するデータ
  const [title, setTitle] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [totalAmount, setTotalAmount] = useState(0);
  const [note, setNote] = useState('');
  const [billings, setBillings] = useState<Billing[]>([{ user: null, splitAmount: 0 }]);
  const [isLoading, setIsLoading] = useState(false);

  // エラーメッセージ
  const [message, setMessage] = useState('');

  const [optionUsers, setOptionUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers().then();
  }, []);

  const fetchUsers = async () => {
    try {
      const users = await getUsersList();
      setOptionUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const remainingAmount =
    totalAmount - billings.reduce((acc, billing) => acc + billing.splitAmount, 0);

  const confirmMessage = () => {
    if (remainingAmount === 0) return '一度登録したデータは編集できません。登録しますか？';
    else if (remainingAmount > 0) return `あと${remainingAmount}円が未精算です。\n登録しますか？`;
    else return `立替総額より${-remainingAmount}円多く請求しています。\n登録しますか？`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const confirmResult = window.confirm(confirmMessage());
    if (!confirmResult) return;

    setMessage('');
    setIsLoading(true);
    try {
      await createPayment(title, paymentDate, totalAmount, billings, note);
      router.push('/payments');
    } catch (error) {
      setMessage(`保存に失敗しました\nError: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 flex flex-col justify-center font-geist">
      <p className="mb-4 font-bold">
        <span className="underline cursor-pointer" onClick={() => router.push('/payments')}>
          一覧
        </span>{' '}
        ＞ 新規請求
      </p>

      <h1 className="text-center text-2xl font-bold">新規請求</h1>
      <p className="mt-2 text-[12px]">
        あなたが立て替えた分を登録しましょう！
        <br />
        （必ず立て替えた人が登録してください）
      </p>

      <form onSubmit={handleSubmit} className="mt-4 w-full max-w-md flex flex-col gap-6">
        <InputField
          type="text"
          placeholder="忘年会2024"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label="支払い名称"
          required={true}
        />
        <InputField
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          label="支払い日"
          required={true}
        />
        <InputField
          type="number"
          value={totalAmount}
          onChange={(e) => setTotalAmount(Number(e.target.value))}
          className="w-36"
          label="立替総額"
          required={true}
        />
        <Textarea
          placeholder="みんなへの備忘録など"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          label="メモ"
          rows={3}
          required={false}
        />

        <BillingsForm billings={billings} optionUsers={optionUsers} onChange={setBillings} />

        <div className="mt-6 w-full flex justify-center">
          <SubmitButton label="登録する" disabled={isLoading} />
        </div>
      </form>

      {message && <p className="mt-4 text-sm text-center text-red-500">{message}</p>}
    </div>
  );
}
