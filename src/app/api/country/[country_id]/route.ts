const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// get a country with specific id
export async function GET(request: Request) {
    const url = new URL(request.url);
    const id = url.searchParams.get('country_id');
    
    if (!id) {
        return new Response(JSON.stringify({
            status: 400,
            message: 'country_id query parameter is required',
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    const countryWanted = await prisma.country.findUnique({
        where: {
            country_id: parseInt(id),
        },
    })

    if (!countryWanted) {
        return new Response(JSON.stringify({
            status: 404,
            message: `No country found with id: ${id}`,
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    return new Response(JSON.stringify({
        status: 200,
        data: countryWanted,
    }), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}