import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export async function POST(request: Request) {
    const body = await request.json();
    const { product_name, product_price, product_category_id, product_image_url, product_description, attributes } = body;

    const selectedAttributes = attributes;

    if (!product_name || !product_price || !product_category_id || !product_description) {
        return new Response(JSON.stringify({
            status: 400,
            message: 'Missing required fields',
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    if (product_price <= 0) {
        return new Response(JSON.stringify({
            status: 400,
            message: 'El precio debe ser mayor a 0',
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    try {
        // ✅ Verificar si "selectedAttributes" es un array válido
        if (!Array.isArray(selectedAttributes)) {
            return new Response(JSON.stringify({
                status: 400,
                message: 'Invalid attributes format',
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
                product_image_url: product_image_url || null,
                product_category_id,
                product_slug: generateSlug(product_name),
                product_description,
                attributes: {
                    create: selectedAttributes.map((attributeId) => ({
                        attribute_id: attributeId,
                    })),
                },
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
    } catch (error: any) {
        console.error('Error creando producto:', error);
        return new Response(JSON.stringify({
            status: 500,
            message: error.message || 'Failed to create product',
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
