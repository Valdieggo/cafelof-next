import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const productCategories = await prisma.productCategory.findMany();
        return new Response(JSON.stringify({
            status: 200,
            data: productCategories
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error fetching product categories:', error);
        return new Response(JSON.stringify({
            status: 500,
            error: 'Internal Server Error',
            message: error.message || 'Unknown error occurred'
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 500,
        });
    }
}