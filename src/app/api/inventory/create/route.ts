import { prisma } from "@/lib/prisma"

export async function POST(request: Request){
    const body = await request.json();
    const { inventory_quantity, product_id } = body;

    if(!product_id || !inventory_quantity){
        return new Response(JSON.stringify({
            status: 400,
            message: 'Missing required fields',
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    const product = await prisma.product.findUnique({
      where: {
        product_id: product_id,
      },
    });
    if(!product){
        return new Response(JSON.stringify({
            status: 404,
            message: 'Producto no encontrado',
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    try{
        const inventory = await prisma.inventory.create({
            data: {
                inventory_quantity: inventory_quantity,
                product_id: product_id,
            },
        });

        return new Response(JSON.stringify({
            status: 201,
            message: 'Inventario creado con exito',
            data: inventory,
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }catch(error){
        return new Response(JSON.stringify({
            status: 400,
            message: 'Error al crear inventario',
        }), {
          status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}