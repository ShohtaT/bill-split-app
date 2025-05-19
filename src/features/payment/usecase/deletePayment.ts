import {supabaseClient} from "@/shared/lib/supabaseClient";

export async function deletePaymentUseCase(
  paymentId: number
): Promise<void> {
  const { error: errorMyDebtRelations } = await supabaseClient
    .from('DebtRelations')
    .delete()
    .eq('payment_id', paymentId);
  if (errorMyDebtRelations) throw errorMyDebtRelations;

  const { error: errorPayment } = await supabaseClient
    .from('Payments')
    .delete()
    .eq('id', paymentId);
  if (errorPayment) throw errorPayment;
}
