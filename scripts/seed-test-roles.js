const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    console.log('🚀 Iniciando creación de usuarios de prueba...')

    const hashedPassword = await bcrypt.hash('123456', 10)

    // 1. Crear Organización Corporativa (Flota)
    const corpOrg = await prisma.organization.upsert({
        where: { id: 'test-corp-id' },
        update: {},
        create: {
            id: 'test-corp-id',
            name: 'Gremio de Taxis Bogotá',
            type: 'FLEET',
            messageWrapper: `🚗 *NOTIFICACIÓN CORPORATIVA (TAXIS)*
Hola {{name}}, un operario de tu gremio te informa:
"{{plate}} - {{raw_message}}"`
        }
    })
    console.log('✅ Organización Corporativa creada')

    // 2. Crear Organización Institucional (Zonas Azules)
    const instOrg = await prisma.organization.upsert({
        where: { id: 'test-inst-id' },
        update: {},
        create: {
            id: 'test-inst-id',
            name: 'Zonas Azules Centro',
            type: 'INSTITUTIONAL',
            messageWrapper: `🏛️ *AVISO OFICIAL - ZONAS AZULES*
Estimado {{name}}, informamos sobre su vehículo {{plate}}:
"{{raw_message}}"`
        }
    })
    console.log('✅ Organización Institucional creada')

    // 3. Crear Usuario Corporativo
    await prisma.user.upsert({
        where: { email: 'corporate@test.com' },
        update: { role: 'CORPORATE', organizationId: corpOrg.id },
        create: {
            email: 'corporate@test.com',
            name: 'Admin Taxis',
            password: hashedPassword,
            role: 'CORPORATE',
            organizationId: corpOrg.id
        }
    })
    console.log('👤 Usuario Corporativo: corporate@test.com / 123456')

    // 4. Crear Usuario Institucional
    await prisma.user.upsert({
        where: { email: 'institutional@test.com' },
        update: { role: 'INSTITUTIONAL', organizationId: instOrg.id },
        create: {
            email: 'institutional@test.com',
            name: 'Admin Zonas Azules',
            password: hashedPassword,
            role: 'INSTITUTIONAL',
            organizationId: instOrg.id
        }
    })
    console.log('👤 Usuario Institucional: institutional@test.com / 123456')

    console.log('\n✨ Proceso terminado. Ya puedes usar estas credenciales para ensayar.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
