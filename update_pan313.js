const { PrismaClient } = require('./src/generated/client')
// Try to load env manually if needed, but Prisma usually finds it if run from root
const prisma = new PrismaClient()

async function main() {
  const updated = await prisma.vehicle.update({
    where: { plate: 'PAN313' },
    data: { type: 'TAXI' }
  })
  console.log('UPDATE_SUCCESS:' + JSON.stringify(updated))
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
