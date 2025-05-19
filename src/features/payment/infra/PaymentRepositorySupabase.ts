// Supabaseリポジトリ実装（インフラ層）
import { supabaseClient } from '@/shared/lib/supabaseClient';
import { PaymentCreate } from '@/shared/types/payment';

export const paymentRepository = {
  async createPayment(payment: PaymentCreate) {
    const { data, error } = await supabaseClient.from('Payments').insert([payment]);
    if (error) throw error;
    return data;
  },
  async getPaymentsByCreatorId(creatorId: number) {
    const { data, error } = await supabaseClient
      .from('Payments')
      .select()
      .eq('creator_id', creatorId);
    if (error) throw error;
    return data;
  },
  async getLastPayment() {
    const { data, error } = await supabaseClient
      .from('Payments')
      .select()
      .order('created_at', { ascending: false })
      .limit(1);
    if (error) throw error;
    return data?.[0];
  },
  async getPaymentWithDebtRelations(paymentId: number) {
    const { data, error } = await supabaseClient
      .from('Payments')
      .select('*')
      .eq('id', paymentId)
      .single();
    if (error) throw error;
    return data;
  },
  // 必要に応じて他のメソッドも移植
};
