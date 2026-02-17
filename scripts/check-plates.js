const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const vehicles = await prisma.vehicle.findMany({
        where: {
            plate: { in: ['ABC123', 'PAN313', 'abc123', 'pan313'] }
        },
        select: {
            plate: true,
            organizationId: true
        }
    })
    console.log(JSON.stringify(vehicles, null, 2))
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
