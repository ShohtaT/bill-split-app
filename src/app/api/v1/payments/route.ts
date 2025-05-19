import { createPaymentUseCase, getPaymentsUseCase } from 'src/features/payment/usecase';

export async function POST(req: Request) {
  const { title, amount, paymentDate, billings, note, creator_id } = await req.json();
  await createPaymentUseCase({ title, amount, paymentDate, billings, note, creator_id });
  return new Response(null, { status: 201 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user_id');
  if (!userId) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
  }
  const payments = await getPaymentsUseCase(Number.parseInt(userId));
  return new Response(JSON.stringify(payments), { status: 200 });
}
