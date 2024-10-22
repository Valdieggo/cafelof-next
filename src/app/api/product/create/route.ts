const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

export async function POST(request: Request){
    const body = await request.json();
    const { product_name, product_price, product_categorie_id } = body;

    if (!product_name || !product_price || !product_categorie_id) {
        return new Response(JSON.stringify({
            status: 400,
            message: 'Missing required fields',
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    const product = await prisma.product.create({
        data: {
            product_name,
            product_price,
            product_categorie_id
        },
    });

    return new Response(JSON.stringify({
        status: 201,
        data: product,
    }), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}