const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

export async function GET(){
    const allCountries = await prisma.country.findMany();
    if(allCountries.length === 0){
        return new Response(JSON.stringify({
            status: 404,
            message: 'No country found',
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    return new Response(JSON.stringify({
        status: 200,
        data: allCountries
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
}