const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    await prisma.country.createMany({
        data: [
            {country_name: "Argentina"},
            {country_name: "Bolivia"},
            {country_name: "Brazil"},
            {country_name: "Chile"},
            {country_name: "Colombia"},
            {country_name: "Ecuador"},
            {country_name: "Paraguay"},
            {country_name: "Peru"},
            {country_name: "Uruguay"},
            {country_name: "Venezuela"}
          ]
    })

    const chile = await prisma.country.findUnique({
        where: {country_name: "Chile"}
    })

    await prisma.region.createMany({
        data: [
            {region_name: "Arica y Parinacota", country_id: chile.country_id},
            {region_name: "Tarapacá", country_id: chile.country_id},
            {region_name: "Antofagasta", country_id: chile.country_id},
            {region_name: "Atacama", country_id: chile.country_id},
            {region_name: "Coquimbo", country_id: chile.country_id},
            {region_name: "Valparaíso", country_id: chile.country_id},
            {region_name: "Metropolitana de Santiago", country_id: chile.country_id},
            {region_name: "Libertador General Bernardo O'Higgins", country_id: chile.country_id},
            {region_name: "Maule", country_id: chile.country_id},
            {region_name: "Ñuble", country_id: chile.country_id},
            {region_name: "Biobío", country_id: chile.country_id},
            {region_name: "La Araucanía", country_id: chile.country_id},
            {region_name: "Los Ríos", country_id: chile.country_id},
            {region_name: "Los Lagos", country_id: chile.country_id},
            {region_name: "Aysén del General Carlos Ibáñez del Campo", country_id: chile.country_id},
            {region_name: "Magallanes y de la Antártica Chilena", country_id: chile.country_id}
        ]
    })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })