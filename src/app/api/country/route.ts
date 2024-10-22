const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

export async function GET(){
    const allCountries = await prisma.country.findMany();

    return new Response(JSON.stringify({
        status: 200,
        data: allCountries
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
}