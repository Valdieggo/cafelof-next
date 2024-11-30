import { commitTransaction } from '@/lib/webpay';

export async function POST(request: Request) {
  try {
    // Leer el cuerpo de la solicitud
    const body = await request.json();
    const { token_ws } = body;

    // Validar que el token esté presente
    if (!token_ws) {
      return new Response(JSON.stringify({ error: 'Token no proporcionado' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Confirmar la transacción con Webpay
    const response = await commitTransaction(token_ws);

    // Retornar la respuesta como JSON
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al confirmar la transacción: 1', error);

    return new Response(
      JSON.stringify({ error: 'Error al confirmar la transacción 2' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
