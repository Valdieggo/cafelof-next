import { createTransaction } from '@/lib/webpay';

export async function POST(request: Request) {
  try {
    // Leer el cuerpo de la solicitud
    const { amount } = await request.json();

    // Validar que `amount` sea un número
    if (!amount || typeof amount !== 'number') {
      return new Response(
        JSON.stringify({ error: 'El monto es obligatorio y debe ser un número' }),
        { status: 400 }
      );
    }

    // Crear la transacción
    const response = await createTransaction(amount);

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

export function GET() {
  return new Response(null, {
    status: 405,
    headers: { Allow: 'POST' },
  });
}
