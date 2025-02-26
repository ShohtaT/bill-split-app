import { supabaseClient } from '@/lib/supabase/supabaseClient';
import { getCurrentUser } from '@/app/api/helper/authHelper';
import { DebtRelation, DebtRelationsResponse } from '@/types/debtRelation';

/**
 * Retrieve DebtRelation
 *
 * @param paymentId
 */
export async function getDebtRelations(paymentId: number): Promise<DebtRelationsResponse | null> {
  const currentUser = await getCurrentUser();
  if (currentUser === null) return null;

  // paymentId が紐づく Payment を取得。その中に紐づく DebtRelations, Users も結合して取得する。
  const { data, error } = await supabaseClient
    .from('Payments')
    .select(
      `
        *,
        DebtRelations (
          *,
          payee:Users!DebtRelations_payee_id_fkey(*)
        )
      `
    )
    .eq('id', paymentId)
    .limit(1);

  if (error) {
    console.error('Error fetching debt relations:', error);
    throw error;
  }

  const payment = data?.[0];
  const debtRelations: DebtRelation[] = payment?.DebtRelations ?? [];

  return {
    payment: payment,
    debt_relations:
      debtRelations.map((debtRelation) => {
        return {
          payee: debtRelation.payee,
          ...debtRelation,
        };
      }) ?? [],
  };
}

/**
 * Update DebtRelation
 *
 * @param id number
 * @param params Partial<DebtRelation>
 */
export async function updateDebtRelations(id: number, params: Partial<DebtRelation>) {
  const currentUser = await getCurrentUser();
  if (currentUser === null) return null;

  const { error } = await supabaseClient
    .from('DebtRelations')
    .update({ ...params, updated_at: new Date() })
    .eq('id', id);

  if (error) {
    console.error('Error updating debt relation:', error);
    throw error;
  }
}
