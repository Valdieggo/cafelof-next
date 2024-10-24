import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const body = await request.json();
    const { product_categorie_name, product_categorie_description } = body;

    if (!product_categorie_name || !product_categorie_description) {
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
        const productCategorie = await prisma.productCategorie.create({
            data: {
                product_categorie_name,
                product_categorie_description,
            },
        });

        console.log("productCategorie: ", productCategorie);
        return new Response(JSON.stringify({
            status: 201,
            message: 'Categoría creada con exito',
            data: productCategorie,
        }), {
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
