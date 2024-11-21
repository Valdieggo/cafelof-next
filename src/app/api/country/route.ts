const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

export async function GET(){
    
  try {
    const allCountries = await prisma.country.findMany({
      select: {
        country_id: true,
        country_name: true,
      },
    });

    return new Response(JSON.stringify({
        status: 200,
        data: allCountries,
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    
  } catch (error) {
    console.error('Error fetching countries:', error);
    return new Response(JSON.stringify({
        status: 500,
        message: 'Internal Server Error',
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
}
