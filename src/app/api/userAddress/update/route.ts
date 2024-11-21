import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userAddressId, userAddressStreet, cityId } = body;

    // Validar datos requeridos
    if (!userAddressId || !userAddressStreet || !cityId) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    // Actualizar la dirección en la base de datos
    const updatedAddress = await prisma.userAddress.update({
      where: { user_address_id: userAddressId },
      data: {
        user_address_street: userAddressStreet,
        city_id: cityId,
      },
    });

    return NextResponse.json(
      { message: "Dirección actualizada exitosamente", address: updatedAddress },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar la dirección:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
