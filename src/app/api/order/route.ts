import { prisma } from "@/lib/prisma";

export async function GET(request: Request){
  try {
    const allOrders = await prisma.order.findMany();
    return new Response(JSON.stringify(allOrders), {
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