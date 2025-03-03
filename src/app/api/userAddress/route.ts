import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const addressId = parseInt(url.searchParams.get("user_address_id") || "", 10);

  if (isNaN(addressId)) {
    return new Response(
      JSON.stringify({
        status: 400,
        message: "El parámetro 'user_address_id' debe ser un número.",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 400,
      }
    );
  }

  try {
    const userAddress = await prisma.userAddress.findUnique({
      where: { user_address_id: addressId },
      select: {
        user_address_street: true,
        city: {
          select: {
            city_name: true,
            region: {
              select: {
                region_name: true,
                country: {
                  select: {
                    country_name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!userAddress) {
      return new Response(
        JSON.stringify({
          status: 404,
          message: "No se encontró la dirección del usuario.",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 404,
        }
      );
    }

    // Construir la respuesta con los datos de la dirección
    const { user_address_street, city } = userAddress;
    const address = {
      street: user_address_street,
      city: city?.city_name,
      region: city?.region?.region_name,
      country: city?.region?.country?.country_name,
    };

    return new Response(
      JSON.stringify({
        status: 200,
        message: "Dirección obtenida exitosamente.",
        data: address,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error al obtener la dirección:", error);
    return new Response(
      JSON.stringify({
        status: 500,
        message: "Error interno del servidor.",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
}
