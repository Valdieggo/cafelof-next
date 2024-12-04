import { createTransaction } from '@/lib/webpay';

export async function POST(request: Request) {
  try {
    const { orderId, sessionId, amount } = await request.json();

    // Validar los datos
    if (!orderId || !sessionId || !amount) {
      return new Response(
        JSON.stringify({ error: 'Faltan datos requeridos para la transacción' }),
        { status: 400 }
      );
    }

    // Crear la transacción en Webpay
    const response = await createTransaction(orderId, sessionId, amount);

    // Retornar la respuesta con status 200
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error('Error al crear la transacción:', error);

    return new Response(
      JSON.stringify({ error: 'Error al crear la transacción' }),
      { status: 500 }
    );
  }
}
