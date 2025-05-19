import {Payment} from "@/shared/types/payment";
import {DebtRelation} from "@/shared/types/debtRelation";
import {supabaseClient} from "@/shared/lib/supabaseClient";

type PaymentDetail = {
  payment: Payment;
  debt_relations: DebtRelation[];
}

export async function getPaymentDetailUseCase(
  paymentId: number
): Promise<PaymentDetail> {
  const { data: myDebtRelations, error: errorMyDebtRelations } = await supabaseClient
    .from('DebtRelations')
    .select()
    .eq('payment_id', paymentId);
  if (errorMyDebtRelations) throw errorMyDebtRelations;
  
  const { data: myPayment, error: errorMyPayments } = await supabaseClient
    .from('Payments')
    .select()
    .eq('id', paymentId)
    .single();
  if (errorMyPayments) throw errorMyPayments;

  // 関連するユーザーを取得
  const userIds = [
    ...myDebtRelations.map(relation => relation.payee_id),
    myPayment.creator_id
  ];
  const { data: users, error: errorUsers } = await supabaseClient
    .from('Users')
    .select()
    .in('id', userIds);
  if (errorUsers) throw errorUsers;

  // DebtRelation にユーザー情報を追加（請求される人）
  myDebtRelations.map((relation) => {
    const user = users.find(user => user.id === relation.payee_id);
    if (user) {
      relation.payee = user;
    }
  })

  // Payment にユーザー情報を追加（請求者）
  myPayment.creator = users.find(user => user.id === myPayment.creator_id);

  return {
    payment: myPayment,
    debt_relations: myDebtRelations
  };
}
