const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('📝 Creando plantillas oficiales para Zonas Azules...')

    // Buscamos la organización institucional
    const instOrg = await prisma.organization.findUnique({
        where: { id: 'test-inst-id' }
    })

    if (!instOrg) {
        console.error('❌ No se encontró la organización institucional. Ejecuta primero seed-test-roles.js')
        return
    }

    const templates = [
        {
            name: '⚠️ TICKET POR VENCER',
            content: 'Su tiempo de estacionamiento en la zona azul está próximo a vencer (5 min). Por favor, renueve su ticket para evitar sanciones.',
            type: 'CAR',
            category: 'ADVICE'
        },
        {
            name: '🚫 LUGAR PROHIBIDO',
            content: 'El vehículo se encuentra en una zona de parqueo NO permitida o de cargue/descargue. Por favor movilícelo a la brevedad.',
            type: 'CAR',
            category: 'WARNING'
        },
        {
            name: '♿ ESPACIO DISCAPACITADOS',
            content: 'Está ocupando un espacio exclusivo para personas con movilidad reducida sin la identificación correspondiente. Favor retirar el vehículo.',
            type: 'CAR',
            category: 'URGENT'
        },
        {
            name: '🚒 BLOQUEO DE HIDRANTE',
            content: 'Urgente: Su vehículo está bloqueando un hidrante de emergencia o rampa de acceso. Retírelo inmediatamente.',
            type: 'CAR',
            category: 'URGENT'
        },
        {
            name: '⚠️ RESTRICCIÓN AMBIENTAL',
            content: 'Su vehículo no cumple con el permiso de circulación ambiental para esta zona hoy.',
            type: 'CAR',
            category: 'URGENT'
        },
        {
            name: '🤝 RECORDATORIO DE PAGO',
            content: 'No registramos pago activo para su estancia en esta zona. Puede realizar el pago con el operario más cercano.',
            type: 'CAR',
            category: 'ADVICE'
        }
    ]

    console.log('🚀 Insertando plantillas...')

    for (const t of templates) {
        // Borramos si ya existe para evitar errores sin ídice único
        const existing = await prisma.notificationTemplate.findFirst({
            where: { name: t.name, organizationId: instOrg.id }
        })

        if (existing) {
            await prisma.notificationTemplate.delete({ where: { id: existing.id } })
        }

        await prisma.notificationTemplate.create({
            data: {
                name: t.name,
                content: t.content,
                type: t.type,
                isActive: true,
                organizationId: instOrg.id
            }
        })
        console.log(`✅ Plantilla creada: ${t.name}`)
    }

    console.log('\n✨ ¡Listo! Los operarios ya verán estos mensajes en el link de bypass.')
    console.log('📱 Link: http://localhost:3000/zone/' + instOrg.publicToken)
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
