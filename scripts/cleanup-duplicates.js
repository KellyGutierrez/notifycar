const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function cleanupDuplicates() {
    console.log('Buscando duplicados...')
    const templates = await prisma.notificationTemplate.findMany()

    const seen = new Set()
    const toDelete = []

    for (const t of templates) {
        if (seen.has(t.name)) {
            toDelete.push(t.id)
        } else {
            seen.add(t.name)
        }
    }

    if (toDelete.length > 0) {
        console.log(`Eliminando ${toDelete.length} duplicados...`)
        await prisma.notificationTemplate.deleteMany({
            where: {
                id: { in: toDelete }
            }
        })
        console.log('¡Duplicados eliminados!')
    } else {
        console.log('No se encontraron duplicados.')
    }
}

cleanupDuplicates()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
