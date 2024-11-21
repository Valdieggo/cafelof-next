import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, userAddressStreet, cityId } = body;

    if (!userId || !userAddressStreet || !cityId) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    // Crear una nueva entrada en UserAddress
    const newAddress = await prisma.userAddress.create({
      data: {
        user_address_street: userAddressStreet,
        city_id: cityId,
      },
    });

    // Actualizar el user_address_id del usuario
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        user_address_id: newAddress.user_address_id,
      },
    });

    // Responder con la dirección creada
    return NextResponse.json(
      { message: "Dirección guardada exitosamente", address: newAddress },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al guardar la dirección:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
