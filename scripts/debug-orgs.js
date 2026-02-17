const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('--- ORGANIZATIONS ---')
    const orgs = await prisma.organization.findMany()
    console.log(JSON.stringify(orgs, null, 2))

    console.log('\n--- VEHICLES (ABC123 & PAN313) ---')
    const vehicles = await prisma.vehicle.findMany({
        where: {
            plate: { in: ['ABC123', 'PAN313', 'abc123', 'pan313'] }
        }
    })
    console.log(JSON.stringify(vehicles, null, 2))

    console.log('\n--- TEMPLATES ---')
    const templates = await prisma.notificationTemplate.findMany()
    console.log(JSON.stringify(templates, null, 2))
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
