const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

export async function POST(request: Request) {
    const body = await request.json();
    const { product_categorie_name, product_categorie_description } = body;

    if (!product_categorie_name || !product_categorie_description) {
        return new Response(JSON.stringify({
            status: 400,
            message: 'Missing required fields',
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    const productCategorie = await prisma.productCategorie.create({
        data: {
            product_categorie_name,
            product_categorie_description,
        },
    });

    return new Response(JSON.stringify({
        status: 201,
        data: productCategorie,
    }), {
        headers: {
            'Content-Type': 'application/json',
        },
    });

}