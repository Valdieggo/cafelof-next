import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const secret = process.env.AUTH_SECRET;

export async function PUT(request: Request, { params }: { params: { order_id: string } }) {
  try {
    // Verificar el token JWT
    const token = await getToken({ req: request, secret });

    // Verificar si el usuario tiene el rol de ADMIN
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    // Obtener el nuevo estado del cuerpo de la solicitud
    const { transaction_status } = await request.json();

    // Validar que el nuevo estado sea válido
    const validStatuses = ["AUTHORIZED", "FAILED", "CREADA", "ENVIADO"];
    if (!validStatuses.includes(transaction_status)) {
      return NextResponse.json(
        { error: "Invalid transaction status" },
        { status: 400 }
      );
    }

    // Actualizar el estado de la orden en la base de datos
    const updatedOrder = await prisma.order.update({
      where: { order_id: params.order_id },
      data: { transaction_status },
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Error updating order status" },
      { status: 500 }
    );
  }
}