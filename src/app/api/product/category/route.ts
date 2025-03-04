import { prisma } from '@/lib/prisma';
import { revalidateTag } from 'next/cache';

export async function GET(request: Request) {
    try {
        const productCategories = await prisma.productCategory.findMany({
          select: {
            product_category_id: true,
            product_category_name: true,
            product_category_description: true,
          }
        });

        revalidateTag('productCategories');
        return new Response(JSON.stringify({
            status: 200,
            data: productCategories
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error: any) {
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
