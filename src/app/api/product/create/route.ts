import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const body = await request.json();
    const { product_name, product_price, product_category_id, product_image_url } = body;

    // Validate required fields
    if (!product_name || !product_price || !product_category_id) {
        return new Response(JSON.stringify({
            status: 400,
            message: 'Missing required fields',
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    try {
        const product = await prisma.product.create({
            data: {
                product_name,
                product_price,
                product_image_url: product_image_url || null, // Handle optional field
                product_category_id,
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
    } catch (error) {
        console.error('Error creating product:', error);
        return new Response(JSON.stringify({
            status: 500,
            message: 'Failed to create product',
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
