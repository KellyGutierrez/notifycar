const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('--- Diagnóstico de Plantillas ---')
    const templates = await prisma.notificationTemplate.findMany({
        include: { organization: true }
    })

    console.log(`Total plantillas: ${templates.length}`)
    templates.forEach(t => {
        console.log(`- [${t.isActive ? 'ACTIVA' : 'INACT'}] ID: ${t.id} | Name: ${t.name} | Org: ${t.organization?.name || 'GLOBAL'} (${t.organizationId})`)
    })

    const users = await prisma.user.findMany({
        where: { role: 'INSTITUTIONAL' },
        include: { organization: true }
    })
    console.log('\n--- Usuarios Institucionales ---')
    users.forEach(u => {
        console.log(`- User: ${u.email} | Org: ${u.organization?.name || 'NINGUNA'} (${u.organizationId})`)
    })
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
