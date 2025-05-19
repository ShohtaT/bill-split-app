'use client';

import { User } from '@/shared/types/user';
import { Billing } from '@/shared/types/payment';
import InputNumberField from '@/components/common/form/inputNumberField';

interface BillingsFormProps {
  billings: Billing[];
  optionUsers: User[];
  onChange: (updatedBillings: Billing[]) => void;
}

export default function BillingsForm({ billings, optionUsers, onChange }: BillingsFormProps) {
  const handleUserChange = (index: number, userId: number) => {
    const updatedBillings: Billing[] = billings.map((billing, i) =>
      i === index
        ? { ...billing, user: optionUsers.find((option) => option.id === userId) || null }
        : billing
    );
    onChange(updatedBillings);
  };

  const handleAmountChange = (index: number, amount: number) => {
    const updatedBillings = billings.map((billing, i) =>
      i === index ? { ...billing, splitAmount: amount } : billing
    );
    onChange(updatedBillings);
  };

  return (
    <div>
      <label className="text-sm font-semibold">
        立替内訳<span className="ml-1 text-red-500">*</span>
      </label>
      <div className="flex flex-col gap-2">
        {billings.map((billing, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <select
              className="border p-3 rounded-md w-full text-black h-[50px]"
              value={billing.user?.id || 0}
              onChange={(e) => handleUserChange(index, Number(e.target.value))}
              required
            >
              <option value={0}>選択してください</option>
              {optionUsers.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.nickname}
                </option>
              ))}
            </select>

            <div className="flex items-end">
              <InputNumberField
                value={billing.splitAmount}
                onChange={(value) => handleAmountChange(index, Number(value))}
                className="w-24"
                required
              />
              <p className="ml-1">円</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 w-full flex justify-center">
        <span
          className="border border-gray-950 dark:border-white px-5 rounded-full cursor-pointer"
          onClick={() => onChange([...billings, { user: null, splitAmount: 0 }])}
        >
          ＋追加
        </span>
      </div>
    </div>
  );
}
