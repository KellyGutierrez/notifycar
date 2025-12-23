const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkDuplicates() {
    const templates = await prisma.notificationTemplate.findMany()
    const counts = {}

    templates.forEach(t => {
        counts[t.name] = (counts[t.name] || 0) + 1
    })

    console.log('--- Template Counts ---')
    Object.entries(counts).forEach(([name, count]) => {
        if (count > 1) {
            console.log(`${name}: ${count}`)
        }
    })

    console.log('\n--- All Templates ---')
    templates.forEach(t => {
        console.log(`[${t.vehicleType}] ${t.name} (id: ${t.id})`)
    })
}

checkDuplicates()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
