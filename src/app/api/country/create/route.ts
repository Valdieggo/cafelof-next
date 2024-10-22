const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const newCountry = await prisma.country.create({
            data: {
                country_name: body.country_name,
            }
        });

        return new Response(JSON.stringify({
            data: newCountry
        }), {
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.log("el error es: ", error.code);
        // Si es un error de unicidad, lo manejamos específicamente
        if (error.code === 'P2002') {
            return new Response(JSON.stringify({
                status: 400,
                message: `El país con nombre ya existe.`,
            }), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Otros errores pueden ser manejados aquí
        return new Response(JSON.stringify({
            status: 500,
            message: 'Error interno del servidor',
            error: error.message,
        }), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
