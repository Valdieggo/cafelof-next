import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const country_id = url.searchParams.get('country_id');

  if (!country_id) {
    return new Response(JSON.stringify({
      status: 400,
      message: 'country_id query parameter is required',
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const regions = await prisma.region.findMany({
      where: {
        country_id: parseInt(country_id), // Convertir a número
      },
      select: {
        region_id: true,
        region_name: true,
      },
    });

    return new Response(JSON.stringify({
      status: 200,
      data: regions,
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
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}