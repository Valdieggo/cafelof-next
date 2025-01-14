import { PrismaClient, Prisma } from '@prisma/client';
import { validateRequiredFields } from '../../../../../../utils/validateFields';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const body = await request.json();
    const { product_category_name, product_category_description } = body;

    const missingFields = validateRequiredFields(body, ['product_category_name', 'product_category_description']);

    if (missingFields.length > 0) {
        return new Response(JSON.stringify({
            message: 'Faltan campos por llenar',
            missingFields: missingFields
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    try {
        const productCategory = await prisma.productCategory.create({
            data: {
                product_category_name,
                product_category_description,
            },
        });

        return new Response(JSON.stringify({
            status: 201,
            message: 'Categoría creada con exito',
            data: productCategory,
        }), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return new Response(JSON.stringify({
                    status: 400,
                    message: 'La categoria del producto ya existe',
                }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }
        }

        return new Response(JSON.stringify({
            status: 400,
            message: 'Error al crear categoria de producto',
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
