import { User } from '@/types/user';
import { Payment } from '@/types/payment';

export interface DebtRelation {
  id: number;
  payment_id: number;
  payment?: Payment & { creator?: User };
  payee_id: number;
  payee?: User;
  status: 'awaiting' | 'completed';
  split_amount: number;
  paid_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DebtRelationCreate {
  payment_id: number;
  payee_id: number;
  status: 'awaiting' | 'completed';
  split_amount: number;
}

export interface DebtRelationsResponse {
  payment: Payment;
  debt_relations: DebtRelation[];
}
