const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

export async function GET(){

    const allCountries = await prisma.country.findMany({
        where: {
            country_name: {
                startsWith: 'C'
            }
        },
    })

    return new Response(JSON.stringify({
        data: allCountries
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
}

export async function POST(request: Request){
    const body = await request.json();
    const newCountry = await prisma.country.create({
        data: {
            country_name: body.country_name,
        }
    })

    return new Response(JSON.stringify({
        data: newCountry
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
}