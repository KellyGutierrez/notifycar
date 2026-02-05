const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

// Cargar variables de entorno prioritariamente desde .env.local, luego .env
const envPaths = [path.join(__dirname, '../.env.local'), path.join(__dirname, '../.env')]
envPaths.forEach(envPath => {
    if (fs.existsSync(envPath)) {
        const envFile = fs.readFileSync(envPath, 'utf8')
        envFile.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=')
            if (key && valueParts.length > 0) {
                const cleanedKey = key.trim()
                if (!process.env[cleanedKey]) {
                    process.env[cleanedKey] = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
                }
            }
        })
    }
})

const prisma = new PrismaClient()

async function main() {
    const templates = [
        // TODOS (ALL) - Afecta a Combustión, Eléctricos y Motos
        { name: "Bloqueo de vía", content: "Tu vehículo está bloqueando una salida. ¿Podrías revisarlo, por favor?", vehicleType: "ALL", category: "COMMON" },
        { name: "Mal parqueado", content: "Tu vehículo está mal parqueado y podría ser remolcado.", vehicleType: "ALL", category: "COMMON" },
        { name: "Frente a salida", content: "Parece que tu vehículo está mal parqueado en una salida de parqueadero", vehicleType: "ALL", category: "COMMON" },
        { name: "Obstrucción paso", content: "Tu vehículo está obstruyendo el paso y está afectando la circulación.", vehicleType: "ALL", category: "COMMON" },
        { name: "Alarma sonando", content: "La alarma de tu vehículo lleva un tiempo sonando.", vehicleType: "ALL", category: "COMMON" },
        { name: "Llanta baja", content: "Una de las llantas de tu vehículo parece estar baja.", vehicleType: "ALL", category: "COMMON" },
        { name: "Estacionarias encendidas", content: "Dejaste las luces estacionarias de tu vehículo encendidas.", vehicleType: "ALL", category: "COMMON" },
        { name: "Vandalismo", content: "Tu vehículo presenta señales de vandalismo.", vehicleType: "ALL", category: "URGENT" },

        // COMBUSTIÓN - ELÉCTRICOS (CAR)
        { name: "Puerta abierta", content: "Una de las puertas de tu vehículo está abierta.", vehicleType: "CAR", category: "COMMON" },
        { name: "Vidrio roto", content: "Uno de los vidrios de tu vehículo parece estar roto.", vehicleType: "CAR", category: "URGENT" },

        // SOLO ELÉCTRICO (ELECTRIC)
        { name: "Fin de carga", content: "Tu vehículo ya terminó de cargar y hay otros esperando el punto.", vehicleType: "ELECTRIC", category: "COMMON" },
        { name: "Puesto de cargador ocupado", content: "Tu vehículo está ocupando un cargador y hay otros conductores esperando para cargar. ¿Podrías moverlo si ya terminó, por favor?", vehicleType: "ELECTRIC", category: "COMMON" },
        { name: "Mal parqueo cargador", content: "Tu vehículo está mal parqueado y no permite usar uno de los cargadores", vehicleType: "ELECTRIC", category: "COMMON" },

        // SOLO MOTOS (MOTORCYCLE)
        { name: "Riesgo de caída", content: "Tu moto podría caerse o moverse.", vehicleType: "MOTORCYCLE", category: "URGENT" },
        { name: "Casco olvidado", content: "Dejaste un casco sobre la moto o colgado, podrías perderlo.", vehicleType: "MOTORCYCLE", category: "COMMON" },
        { name: "Llaves pegadas", content: "Olvidaste las llaves puestas en el encendido o en el seguro del asiento.", vehicleType: "MOTORCYCLE", category: "URGENT" },
        { name: "Pata mal puesta", content: "La pata de apoyo se está hundiendo o está mal puesta, hay riesgo de caída.", vehicleType: "MOTORCYCLE", category: "URGENT" },
        { name: "Fuga de líquidos", content: "Parece que tu moto está goteando gasolina o aceite.", vehicleType: "MOTORCYCLE", category: "URGENT" },
        { name: "Luces encendidas", content: "Dejaste las luces de tu moto encendidas, podrías quedarte sin batería.", vehicleType: "MOTORCYCLE", category: "COMMON" },

        // 💰 COMERCIAL (COMMERCIAL)
        { name: "Interés en compra", content: "Estoy interesado en comprar tu vehículo.", vehicleType: "ALL", category: "COMMERCIAL" },
    ]

    console.log('Sincronizando configuración global y formato de WhatsApp...')
    const defaultWrapper = `🚗 *Hola {{name}}, NotifyCar te avisa:*
Alguien cerca de tu vehículo quiso avisarte lo siguiente:
“{{plate}} - {{raw_message}}”

ℹ️ Este aviso fue enviado a través de NotifyCar usando únicamente la placa de tu vehículo. No se compartió tu número ni ningún dato personal.

🔐 *Recomendación de seguridad:*
Verifica la situación con calma, revisa el entorno antes y evita confrontaciones directas. Si notas algún riesgo, considera contactar a las autoridades.

📞 *Números de emergencia:*
 - Policía: {{NUM_POLICIA}}
 - Tránsito: {{NUM_TRANSITO}}
 - Emergencias: {{NUM_EMERGENCIAS}}

—
NotifyCar · Comunicación inteligente en la vía
www.notifycar.com`;

    await prisma.systemSetting.upsert({
        where: { id: "default" },
        update: { messageWrapper: defaultWrapper },
        create: {
            id: "default",
            messageWrapper: defaultWrapper,
            systemName: "NotifyCar"
        }
    });

    console.log('Migrando plantillas...')

    // Opcional: Desactivar plantillas antiguas que no estén en la nueva lista
    const templateNames = templates.map(t => t.name)
    await prisma.notificationTemplate.updateMany({
        where: { NOT: { name: { in: templateNames } } },
        data: { isActive: false }
    })

    for (const t of templates) {
        const existing = await prisma.notificationTemplate.findFirst({ where: { name: t.name } })
        if (existing) {
            await prisma.notificationTemplate.update({
                where: { id: existing.id },
                data: { ...t, isActive: true }
            })
        } else {
            await prisma.notificationTemplate.create({
                data: t
            })
        }
    }

    console.log('¡Plantillas migradas con éxito!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
