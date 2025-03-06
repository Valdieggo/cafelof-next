import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, totalAmount, cartItems } = body;

    // Validar que los datos sean correctos
    if (!userId || !totalAmount ) {
      return new Response(JSON.stringify({ error: 'Datos incompletos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Crear la orden en la base de datos
    const order = await prisma.order.create({
      data: {
        user_id: userId,
        order_total_price: totalAmount,
        order_date: new Date(),
        transaction_status: 'CREADA', 
      },
    });

    const cart = await prisma.cart.findFirst({
      where: {
        user_id: userId
      },
    });

    const orderDetails = cartItems.map((item: any) => ({
      order_id: order.order_id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    await prisma.orderDetail.createMany({
      data: orderDetails,
    });

    return new Response(JSON.stringify(order), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al crear la orden:', error);
    return new Response(JSON.stringify({ error: 'Error al crear la orden' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
