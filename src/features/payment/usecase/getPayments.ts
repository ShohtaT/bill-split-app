import { supabaseClient } from "@/shared/lib/supabaseClient";
import {Payment} from "@/shared/types/payment";

type PaymentList = {
  awaiting_payments: DebtDetail[];
  completed_payments: DebtDetail[];
}

type DebtDetail = {
  title: string;
  payment_at: string | undefined;
  amount: number | undefined;
  payer_nickname: string;
}

export async function getPaymentsUseCase(currentUserId: number): Promise<PaymentList> {
  const { data: myDebtRelations, error: errorMyDebtRelations } = await supabaseClient
    .from('DebtRelations')
    .select()
    .eq('payee_id', currentUserId);
  if (errorMyDebtRelations) throw errorMyDebtRelations;
  
  const { data: myPayments, error: errorMyPayments } = await supabaseClient
    .from('Payments')
    .select()
    .in('id', myDebtRelations.map(relation => relation.payment_id));
  if (errorMyPayments) throw errorMyPayments;
  
  const { data: users, error: errorUsers } = await supabaseClient
    .from('Users')
    .select('id, nickname')
    .in('id', myPayments.map(payment => payment.creator_id));
  if (errorUsers) throw errorUsers;
  
  const userMap = new Map<number, string>(
    users.map(user => [user.id, user.nickname])
  );
  
  const addCreatorName = (payment: Payment): DebtDetail => ({
    title: payment.title,
    payment_at: payment.payment_at,
    amount: myDebtRelations.find(relation => relation.payment_id === payment.id)?.split_amount,
    payer_nickname: userMap.get(payment.creator_id) || 'Unknown'
  });
  
  const awaiting_payments = myPayments
    .filter(p => p.status === 'awaiting')
    .map((p: Payment) => addCreatorName(p));
  
  const completed_payments = myPayments
    .filter(p => p.status === 'completed')
    .map((p: Payment) => addCreatorName(p));
  
  return { awaiting_payments, completed_payments };
}
