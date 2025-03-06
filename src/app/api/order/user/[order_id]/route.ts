import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { order_id: string } }) {
  try {
    const order_id = params.order_id;

    const order = await prisma.order.findUnique({
      where: { order_id },
      select: {
        user_id: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      );
    }

    // Devolver el user_id y el email
    return NextResponse.json({
      user_id: order.user_id,
      email: order.user.email,
    });
  } catch (error) {
    console.error("Error fetching order user details:", error);
    return NextResponse.json(
      { error: "Error fetching order user details" },
      { status: 500 }
    );
  }
}