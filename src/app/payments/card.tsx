'use client';

import { ExpandedPayment } from '@/shared/types/payment';
import { useRouter } from 'next/navigation';

interface CardProps {
  payment: ExpandedPayment;
}

const DATE_SLICE_LENGTH = 10;

export default function Card({ payment }: CardProps) {
  const isAwaiting = payment.status === 'awaiting';

  const router = useRouter();
  const handleClick = (paymentId: number) => {
    router.push(`/payments/${paymentId}`);
  };

  return (
    <li
      className="bg-white dark:bg-[#1a1a1a] p-5 mb-2 rounded-md w-full cursor-pointer"
      onClick={() => handleClick(payment.id)}
    >
      <div className="flex justify-between items-start">
        <p className="text-2xl font-bold">{payment.title}</p>
        <div
          className={`p-1 border rounded ${
            isAwaiting ? 'border-orange-500 text-orange-500' : 'border-green-500 text-green-500'
          }`}
        >
          {isAwaiting ? '未完了' : '完了'}
        </div>
      </div>
      <p className="mt-1 text-sm">{payment.payment_at?.slice(0, DATE_SLICE_LENGTH)}</p>
    </li>
  );
}
