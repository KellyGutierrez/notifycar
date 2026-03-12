const { PrismaClient } = require('./src/generated/client')
const prisma = new PrismaClient()

async function main() {
  const vehicle = await prisma.vehicle.findUnique({
    where: { plate: 'PAN313' }
  })
  console.log('VEHICLE_DATA:' + JSON.stringify(vehicle))
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
