const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    const allCountrys = await prisma.country.findMany()
  console.log(allCountrys)
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