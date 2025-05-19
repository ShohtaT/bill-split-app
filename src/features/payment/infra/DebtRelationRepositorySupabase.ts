// DebtRelationリポジトリ（インフラ層）
import { supabaseClient } from '@/shared/lib/supabaseClient';
import { DebtRelation, DebtRelationCreate } from '@/shared/types/debtRelation';

export const debtRelationRepository = {
  async createDebtRelation(debtRelation: DebtRelationCreate) {
    const { error } = await supabaseClient.from('DebtRelations').insert([debtRelation]);
    if (error) throw error;
  },
  async getDebtRelationsByPaymentId(paymentId: number) {
    const { data, error } = await supabaseClient
      .from('DebtRelations')
      .select('*')
      .eq('payment_id', paymentId);
    if (error) throw error;
    return data as DebtRelation[];
  },
};
