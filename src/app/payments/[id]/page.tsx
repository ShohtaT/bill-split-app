'use client';

// import { useEffect, useState, useCallback } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Loading from '@/components/common/loading';
// import Card from '@/app/payments/[id]/card';
// import { getPaymentDetailUseCase } from '@/features/payment/usecase/getPaymentDetail';

export default function Page() {
  // const router = useRouter();
  // const params = useParams();
  // const [payment, setPayment] = useState<Payment | null>();
  // const [payer, setPayer] = useState<User | null>();
  // const [debtRelations, setDebtRelations] = useState<DebtRelation[]>();
  // const [isLoading, setIsLoading] = useState(false);
  //
  // const paymentId = Number(params.id);
  //
  // const fetchDebtRelations = useCallback(async () => {
  //   setIsLoading(true);
  //   const detail = await getPaymentDetailUseCase(paymentId);
  //   setPayment(detail?.payment ?? null);
  //   setDebtRelations(detail?.debt_relations ?? []);
  //   setIsLoading(false);
  // }, [paymentId]);
  // useEffect(() => {
  //   fetchDebtRelations();
  // }, [fetchDebtRelations]);
  //
  // const fetchPayer = useCallback(async () => {
  //   if (!payment) return;
  //
  //   const userRepository = new UserRepository();
  //   const data = await userRepository.getUserById(payment?.creator_id);
  //   setPayer(data);
  // }, [payment]);
  // useEffect(() => {
  //   if (payment) fetchPayer();
  // }, [payment, fetchPayer]);
  //
  // const unpaidAmount = (): number => {
  //   if (!debtRelations) return -1;
  //
  //   return debtRelations
  //     .filter((dr) => dr.status === 'awaiting')
  //     .reduce((acc, dr) => acc + dr.split_amount, 0); // 回収済みの金額を除外
  // };
  //
  // const unpaidNumberOfPeople = (): number => {
  //   if (!debtRelations) return -1;
  //
  //   return debtRelations.filter((dr) => dr.status === 'awaiting').length;
  // };
  //
  // // 完了・未完了操作は未実装。必要に応じてAPI経由で実装してください。
  // const completeRepayment = async (debtRelationId: number) => {
  //   // TODO: API経由で支払い完了処理を実装
  // };
  //
  // const rollbackRepayment = async (debtRelationId: number) => {
  //   // TODO: API経由で支払い未完了処理を実装
  // };

  return <div className="mt-6 flex flex-col justify-center font-geist"></div>;
}
