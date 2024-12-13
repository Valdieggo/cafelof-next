import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // Asegúrate de tener Prisma configurado
import { NextResponse } from "next/server";

export async function POST(req: Request, res: NextApiResponse) {
  try {
    const body = await req.json();
    const { name, phone, address, city, email } = body;

    if (!name || !phone || !address || !city || !email) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    // Crear el usuario en la base de datos usando Prisma
    const user = await prisma.user.create({
      data: {
        name,
        email,
        user_phone_number: phone,
      },
    });

    // Crear la dirección en la base de datos usando el addressStreet y cityId
    const userAddress = await prisma.userAddress.create({
      data: {
        user_address_street: address,
        city_id: city,
      },
    });

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        user_address_id: userAddress.user_address_id,
      }
    })

    return NextResponse.json(
      { message: "Usuario y dirección creados exitosamente", user: updatedUser },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
