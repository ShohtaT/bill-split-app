import {getPaymentDetailUseCase} from "src/features/payment/usecase";
import {deletePaymentUseCase} from "@/features/payment/usecase/deletePayment";

export async function GET({ params }: { params: { id: string } }) {
  const paymentId = Number(params.id);
  if (!paymentId) return new Response(JSON.stringify({ error: 'Payment ID is required' }), { status: 400 });

  const detail = await getPaymentDetailUseCase(paymentId);
  if (!detail) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  return new Response(JSON.stringify(detail), { status: 200 });
}

export async function DELETE({ params }: { params: { id: string } }) {
  const paymentId = Number(params.id);
  if (!paymentId) return new Response(JSON.stringify({ error: 'Payment ID is required' }), { status: 400 });
  
  await deletePaymentUseCase(paymentId);
  return new Response(null, { status: 204 });
}
