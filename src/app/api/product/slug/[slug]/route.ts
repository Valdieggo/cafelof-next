import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;

    // Fetch product by slug
    const product = await prisma.product.findUnique({
      where: { product_slug: slug }, // Use product_slug instead of slug
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

    // Handle product not found
    if (!product) {
      return new Response(
        JSON.stringify({
          status: 404,
          message: 'Product not found',
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    // Structure the product response
    const structuredProduct = {
      ...product,
      product_category_name: product.category?.product_category_name || null,
      attributes: product.attributes.map(({ attribute }: any) => ({
        attribute_name: attribute.attribute_name,
        values: attribute.possibleValues.map((enumValue: any) => enumValue.value),
      })),
    };

    return new Response(
      JSON.stringify({
        status: 200,
        data: structuredProduct,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error fetching product by slug:', error);

    return new Response(
      JSON.stringify({
        status: 500,
        message: 'Internal Server Error',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
}
