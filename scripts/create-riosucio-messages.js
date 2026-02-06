const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🚕 Creando mensajes para Gremio de Taxis Riosucio...\n')

    try {
        // 1. Buscar la organización
        const organization = await prisma.organization.findFirst({
            where: {
                name: {
                    contains: 'Riosucio',
                    mode: 'insensitive'
                },
                type: 'FLEET'
            }
        })

        if (!organization) {
            console.error('❌ No se encontró la organización del Gremio de Taxis Riosucio')
            return
        }

        console.log(`✅ Organización encontrada: ${organization.name}\n`)

        // 2. Mensajes personalizados para flotas de taxis
        const messages = [
            {
                name: "📋 Recordatorio de Pago Mensual",
                content: "Hola {name}, te recordamos que tu cuota mensual de la flota vence pronto. Por favor realiza el pago a tiempo para evitar inconvenientes.",
                category: "COMMON",
                vehicleType: "ALL"
            },
            {
                name: "🔧 Mantenimiento Preventivo",
                content: "Estimado conductor, tu vehículo {plate} requiere mantenimiento preventivo. Por favor agenda tu cita en el taller autorizado de la flota.",
                category: "URGENT",
                vehicleType: "CAR"
            },
            {
                name: "📄 Documentos por Vencer",
                content: "Hola {name}, algunos documentos de tu taxi {plate} están próximos a vencer. Por favor actualízalos en la oficina de la flota.",
                category: "URGENT",
                vehicleType: "ALL"
            },
            {
                name: "⏰ Recordatorio de Turno",
                content: "Buen día {name}, te recordamos tu turno programado para hoy. ¡Que tengas un excelente día de trabajo!",
                category: "COMMON",
                vehicleType: "ALL"
            },
            {
                name: "🛑 Vehículo en Revisión",
                content: "Estimado {name}, tu vehículo {plate} se encuentra en revisión técnica. Por favor comunícate con la coordinación de la flota.",
                category: "URGENT",
                vehicleType: "ALL"
            },
            {
                name: "💰 Bonificación Disponible",
                content: "¡Felicidades {name}! Tienes una bonificación disponible por tu excelente desempeño. Pasa por la oficina para reclamarla.",
                category: "COMMON",
                vehicleType: "ALL"
            },
            {
                name: "📞 Llamada de Coordinación",
                content: "Hola {name}, la coordinación de la flota necesita contactarte urgentemente. Por favor comunícate al número de administración.",
                category: "URGENT",
                vehicleType: "ALL"
            },
            {
                name: "🚗 Cambio de Vehículo",
                content: "Estimado {name}, se ha asignado un nuevo vehículo con placa {plate} para tu turno. Por favor recógelo en la base.",
                category: "COMMON",
                vehicleType: "CAR "
            },
            {
                name: "📊 Reporte de Rendimiento",
                content: "Hola {name}, tu reporte de rendimiento mensual está disponible. Revísalo en la oficina de la flota para conocer tus estadísticas.",
                category: "COMMON",
                vehicleType: "ALL"
            },
            {
                name: "⚠️ Alerta de Seguridad",
                content: "Atención {name}, se ha detectado una alerta de seguridad en tu vehículo {plate}. Por favor detén el servicio y dirígete a la base inmediatamente.",
                category: "URGENT",
                vehicleType: "ALL"
            }
        ]

        // 3. Crear los mensajes para la organización
        for (const msg of messages) {
            await prisma.notificationTemplate.create({
                data: {
                    name: msg.name,
                    content: msg.content,
                    category: msg.category,
                    vehicleType: msg.vehicleType,
                    type: "APP",
                    isActive: true,
                    organizationId: organization.id
                }
            })
            console.log(`✅ ${msg.name}`)
        }

        console.log(`\n🎉 Se crearon ${messages.length} mensajes exitosamente!`)
        console.log(`\n📱 Estos mensajes estarán disponibles en el panel corporativo de:`)
        console.log(`   - Organización: ${organization.name}`)
        console.log(`   - Acceso: admin@riosucio.com`)
        console.log(`   - Ruta: /corporate/templates\n`)

    } catch (error) {
        console.error('❌ Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
