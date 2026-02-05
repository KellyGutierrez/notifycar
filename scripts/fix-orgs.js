const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function debug() {
    console.log('🔍 Iniciando Diagnóstico de Organizaciones...')

    try {
        const orgs = await prisma.organization.findMany()
        console.log(`📊 Total organizaciones encontrando: ${orgs.length}`)

        for (const org of orgs) {
            console.log(`- ID: ${org.id} | Nombre: ${org.name} | Token: ${org.publicToken || '❌ NULL'}`)

            if (!org.publicToken) {
                console.log(`  🛠️ Reparando token para ${org.name}...`)
                const token = 'link-' + Math.random().toString(36).substr(2, 6)
                await prisma.organization.update({
                    where: { id: org.id },
                    data: { publicToken: token }
                })
                console.log(`  ✅ Nuevo token asignado: ${token}`)
            }
        }

        const users = await prisma.user.findMany({
            where: { email: { in: ['institutional@test.com', 'corporate@test.com'] } }
        })

        console.log('\n👤 Estado de Usuarios de Prueba:')
        for (const user of users) {
            console.log(`- ${user.email} | Rol: ${user.role} | OrgID: ${user.organizationId || '❌ NULL'}`)
        }

    } catch (error) {
        console.error('❌ Error durante el diagnóstico:', error.message)
        if (error.message.includes('column "publicToken" does not exist')) {
            console.log('\n🚨 ERROR CRÍTICO: La base de datos no tiene la columna "publicToken".')
            console.log('👉 Debes ejecutar: docker exec -it notifycar-app npx prisma db push')
        }
    } finally {
        await prisma.$disconnect()
    }
}

debug()
