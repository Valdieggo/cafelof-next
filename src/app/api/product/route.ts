const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

export async function GET(request: Request){
    const allProducts = await prisma.product.findMany();

    return new Response(JSON.stringify({
        status: 200,
        data: allProducts
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
}