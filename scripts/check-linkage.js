const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('--- Verificación de Base de Datos ---')

    const user = await prisma.user.findUnique({
        where: { email: 'institutional@test.com' },
        include: { organization: true }
    })

    if (!user) {
        console.log('❌ Usuario institutional@test.com no encontrado.')
    } else {
        console.log(`👤 Usuario: ${user.email}`)
        console.log(`🏢 Organización del Usuario: ${user.organization?.name || 'NINGUNA'} (ID: ${user.organizationId})`)
    }

    const templates = await prisma.notificationTemplate.findMany({
        include: { organization: true }
    })

    console.log(`\n📋 Plantillas en la BD (${templates.length}):`)
    templates.forEach(t => {
        console.log(`- [${t.isActive ? 'ACTIVA' : 'INACT'}] ID: ${t.id} | Name: ${t.name} | OrgId: ${t.organizationId} | Match: ${t.organizationId === user?.organizationId ? 'SÍ' : 'NO'}`)
    })
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
