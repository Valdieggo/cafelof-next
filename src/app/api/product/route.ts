import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const allProducts = await prisma.product.findMany({
      include: {
        category: {
          select: {
            product_category_name: true,
          },
        },
      },
    });

    // Map through allProducts to flatten each product object and remove the category object
    const flattenedProducts = allProducts.map(({ category, ...productData }) => ({
      ...productData,
      product_category_name: category?.product_category_name || null,
    }));

    return new Response(
      JSON.stringify({
        status: 200,
        data: flattenedProducts,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error) {
    console.error('Error fetching products:', error);

    return new Response(
      JSON.stringify({
        status: 500,
        message: 'Internal Server Error',
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    );
  }
}
