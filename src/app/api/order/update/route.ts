import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      buyOrder, // Identificador único de la orden
      transactionStatus,
      amount,
      authorizationCode,
      responseCode,
      paymentTypeCode,
      installmentsNumber,
      cardLastFourDigits,
    } = body;

    if (!buyOrder || !transactionStatus || amount === undefined) {
      return new Response(
        JSON.stringify({
          error: 'Faltan datos requeridos: buyOrder, transactionStatus o amount',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { order_id: buyOrder }, // Ahora `order_id` es un String
      data: {
        transaction_status: transactionStatus,
        transaction_amount: amount,
        authorization_code: authorizationCode || null,
        response_code: responseCode || -1,
        payment_type_code: paymentTypeCode || null,
        installments_number: installmentsNumber || 0,
        card_last_four: cardLastFourDigits || null,
      },
    });

    return new Response(JSON.stringify(updatedOrder), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error : any) {
    console.error('Error al actualizar la orden:', error);

    if (error.code === 'P2025') {
      return new Response(
        JSON.stringify({ error: 'Orden no encontrada para actualizar' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Error al actualizar la orden' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
