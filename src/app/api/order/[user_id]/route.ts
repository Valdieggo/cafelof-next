import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { user_id: string } }){
  const { user_id } = params;
  try {
    const orders = await prisma.order.findMany({
      where: {
        user_id: user_id
      }
    });

    if(orders.length === 0){
      return new Response(JSON.stringify({ message: 'No tienes órdenes de compra' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(orders), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }catch(error){
    console.error('Error al obtener las ordenes:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener las ordenes' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}