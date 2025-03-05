import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { order_id: string } }) {
  try {
    const order_id = params.order_id;

    const orderDetails = await prisma.orderDetail.findMany({
      where: { order_id: order_id },
      include: {
        product: {
          select: {
            product_name: true,
            product_price: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(orderDetails), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    return new Response(JSON.stringify({ error: "Error fetching order details" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}