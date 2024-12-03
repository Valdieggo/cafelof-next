import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  const body = await request.json();

  // Extraer datos del cuerpo de la solicitud
  const {
    user_id,
    user_phone_number,
    name,
    user_address_street,
    city_id,
  } = body;

  // Validar que el `user_id` esté presente
  if (!user_id) {
    return new Response(
      JSON.stringify({
        status: 400,
        message: "El campo user_id es obligatorio.",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Construir datos para actualizar el usuario
    const userUpdateData: any = {};
    if (user_phone_number) userUpdateData.user_phone_number = user_phone_number;
    if (name) userUpdateData.name = name;

    // Manejar la dirección del usuario
    if (user_address_street || city_id) {
      // Verificar si el usuario ya tiene una dirección asociada
      const user = await prisma.user.findUnique({
        where: { id: user_id },
        select: { user_address_id: true },
      });

      if (user?.user_address_id) {
        // Actualizar la dirección existente
        await prisma.userAddress.update({
          where: { user_address_id: user.user_address_id },
          data: {
            user_address_street: user_address_street || undefined,
            city_id: city_id || undefined,
          },
        });
      } else if (user_address_street && city_id) {
        // Crear una nueva dirección y asociarla al usuario
        const newAddress = await prisma.userAddress.create({
          data: {
            user_address_street,
            city_id,
          },
        });
        userUpdateData.user_address_id = newAddress.user_address_id;
      }
    }

    // Actualizar los datos del usuario
    const updatedUser = await prisma.user.update({
      where: { id: user_id },
      data: userUpdateData,
    });

    // Respuesta exitosa
    return new Response(
      JSON.stringify({
        status: 200,
        message: "Usuario actualizado con éxito.",
        user: updatedUser,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    return new Response(
      JSON.stringify({
        status: 500,
        message: "Error interno del servidor.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}