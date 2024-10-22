const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

export async function PUT(request: Request) {
    const body = await request.json();
    const { product_id, product_price,} = body;

    if (!product_id) {
        return new Response(JSON.stringify({
            status: 400,
            message: 'Missing required fields',
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }


    const product = await prisma.product.update({
        where: {
            product_id: parseInt(product_id),
        },
        data: {
            product_price,
        },
    });

    return new Response(JSON.stringify({
        status: 200,
        data: product,
    }), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}