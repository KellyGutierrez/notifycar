const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const orgs = await prisma.organization.findMany({
        select: { id: true, name: true }
    })

    const news = [
        {
            name: "🚖 No aceptó destino",
            content: "Estimado {role}, un pasajero reporta que el vehículo {plate} no quiso prestar el servicio al destino indicado. Por favor verificar esta situación.",
            category: "SERVICIO",
            vehicleType: "CAR"
        },
        {
            name: "🗣️ Reporte de trato al usuario",
            content: "Estimado {role}, se informa que un pasajero reportó un trato inadecuado en el vehículo {plate}. Por favor mantener los estándares de cordialidad de la flota.",
            category: "SERVICIO",
            vehicleType: "CAR"
        }
    ]

    console.log(`Encontradas ${orgs.length} organizaciones.`)

    for (const org of orgs) {
        console.log(`Procesando: ${org.name} (${org.id})...`)
        for (const n of news) {
            const existing = await prisma.notificationTemplate.findFirst({
                where: {
                    name: n.name,
                    organizationId: org.id
                }
            })

            if (!existing) {
                await prisma.notificationTemplate.create({
                    data: {
                        ...n,
                        organizationId: org.id,
                        isActive: true,
                        type: "APP"
                    }
                })
                console.log(`  + Agregada: ${n.name}`)
            } else {
                console.log(`  - Ya existe: ${n.name}`)
            }
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
