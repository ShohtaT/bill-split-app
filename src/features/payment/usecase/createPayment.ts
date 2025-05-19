// 支払い作成ユースケース（アプリケーション層）
import { paymentRepository } from '../infra/PaymentRepositorySupabase';
import { debtRelationRepository } from '../infra/DebtRelationRepositorySupabase';
// import { PaymentCreate, Billing } from '@/shared/types/payment';

export async function createPaymentUseCase(input: {
  title: string;
  amount: number;
  paymentDate: string;
  billings: Billing[];
  note?: string;
  creator_id: number;
}) {
  // Payment作成
  await paymentRepository.createPayment({
    title: input.title,
    amount: input.amount,
    note: input.note,
    status: 'awaiting',
    creator_id: input.creator_id,
    payment_at: input.paymentDate,
  });
  const newPayment = await paymentRepository.getLastPayment();
  if (!newPayment) throw new Error('Payment作成失敗');

  // DebtRelation作成
  for (const billing of input.billings) {
    if (!billing.user) continue;
    await debtRelationRepository.createDebtRelation({
      payment_id: newPayment.id,
      payee_id: billing.user.id,
      status: 'awaiting',
      split_amount: billing.splitAmount,
    });
  }
  return newPayment;
}
