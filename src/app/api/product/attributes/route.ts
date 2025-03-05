import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const attributes = await prisma.attribute.findMany({
      include: {
        possibleValues: true, // Incluir los valores posibles de cada atributo
      },
    });

    return new Response(JSON.stringify({
      status: 200,
      data: attributes,
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching attributes:', error);
    return new Response(JSON.stringify({
      status: 500,
      message: 'Failed to fetch attributes',
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}