import { prisma } from '@/lib/prisma';
import { revalidateTag } from 'next/cache';

export async function GET() {
  try {
    const allProducts = await prisma.product.findMany({
      include: {
        category: {
          select: {
            product_category_name: true,
          },
        },
        attributes: {
          include: {
            attribute: {
              include: {
                possibleValues: {
                  select: {
                    value: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    revalidateTag('allProducts');

    // Map through allProducts to flatten the attributes and structure the response
    const structuredProducts = allProducts.map(({ category, attributes, ...productData }) => ({
      ...productData,
      product_category_name: category?.product_category_name || null,
      attributes: attributes.map(({ attribute }) => ({
        attribute_name: attribute.attribute_name,
        values: attribute.possibleValues.map((enumValue) => enumValue.value),
      })),
    }));

    return new Response(
      JSON.stringify({
        status: 200,
        data: structuredProducts,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
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
