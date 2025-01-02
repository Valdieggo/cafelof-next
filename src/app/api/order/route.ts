import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

const secret = process.env.AUTH_SECRET;
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // Extract and verify the JWT
    const token = await getToken({ req: request, secret });

    // Check if the user has the ADMIN role
    if (!token || token.role !== "ADMIN") {
      return new Response(JSON.stringify({ error: "Forbidden: Insufficient permissions" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch all orders if the user is an admin
    const allOrders = await prisma.order.findMany();
    const formattedOrders = allOrders.map(order => ({
      ...order,
      createdAt: order.created_at ? new Date(order.created_at).toISOString() : null, // Handle null case
      updatedAt: order.updated_at ? new Date(order.updated_at).toISOString() : null, // Handle null case
    }));

    return new Response(JSON.stringify(formattedOrders), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new Response(JSON.stringify({ error: "Error fetching orders" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
