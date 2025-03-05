import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const region_id = url.searchParams.get('region_id');

  if (!region_id) {
    return new Response(JSON.stringify({
      status: 400,
      message: 'region_id query parameter is required',
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const cities = await prisma.city.findMany({
      where: {
        region_id: parseInt(region_id), // Convertir a número
      },
      select: {
        city_id: true,
        city_name: true,
      },
    });

    return new Response(JSON.stringify({
      status: 200,
      data: cities,
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: 500,
      message: 'Internal server error',
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}