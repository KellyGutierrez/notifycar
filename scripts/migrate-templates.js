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
        // COMUNES (ALL)
        { name: "Mal estacionado", content: "Hola, tu vehículo está obstruyendo el paso o mal estacionado.", vehicleType: "ALL", category: "COMMON" },
        { name: "Alarma sonando", content: "Hola, la alarma de tu vehículo se ha activado.", vehicleType: "ALL", category: "COMMON" },
        { name: "Grúa/Peligro", content: "¡Atención! Tu vehículo corre peligro de ser remolcado o está en una situación de riesgo.", vehicleType: "ALL", category: "URGENT" },
        { name: "Obstrucción garaje", content: "Hola, su vehículo está obstruyendo la salida de un garaje.", vehicleType: "ALL", category: "URGENT" },
        { name: "Puerta mal cerrada", content: "Hola, una de las puertas de su vehículo parece estar mal cerrada o sin seguro.", vehicleType: "ALL", category: "COMMON" },
        { name: "Baúl abierto", content: "Hola, el baúl o cajuela de su vehículo se encuentra abierto.", vehicleType: "ALL", category: "COMMON" },
        { name: "Mascota/Niño solo", content: "¡AVISO URGENTE! Hay un niño o mascota dentro del vehículo y parece estar en riesgo.", vehicleType: "ALL", category: "URGENT" },
        { name: "Fuga de líquido", content: "Hola, parece haber una fuga de líquido bajo su vehículo.", vehicleType: "ALL", category: "URGENT" },

        // AUTOS (CAR)
        { name: "Luces encendidas", content: "Hola, te informo que dejaste las luces de tu vehículo encendidas.", vehicleType: "CAR", category: "COMMON" },
        { name: "Ventana abierta", content: "Hola, tienes una ventana de tu vehículo abierta.", vehicleType: "CAR", category: "COMMON" },
        { name: "Neumático bajo", content: "Hola, uno de los neumáticos de tu vehículo parece estar bajo de aire.", vehicleType: "CAR", category: "COMMON" },
        { name: "Espejo golpeado", content: "Aviso: El espejo retrovisor de su vehículo ha sido golpeado o está doblado.", vehicleType: "CAR", category: "COMMON" },

        // MOTOS (MOTORCYCLE)
        { name: "Llaves puestas", content: "Hola, olvidaste las llaves puestas en el switch de tu moto.", vehicleType: "MOTORCYCLE", category: "URGENT" },
        { name: "Casco olvidado", content: "Hola, dejaste el casco colgado o sobre la moto.", vehicleType: "MOTORCYCLE", category: "COMMON" },
        { name: "Posición inestable", content: "Tu moto está en una posición inestable o mal apoyada.", vehicleType: "MOTORCYCLE", category: "URGENT" },
        { name: "Funda suelta", content: "La funda o carpa de tu moto se está soltando por el viento.", vehicleType: "MOTORCYCLE", category: "COMMON" },
        { name: "Derrame/Aceite", content: "Parece que tu moto está goteando aceite o algún líquido.", vehicleType: "MOTORCYCLE", category: "URGENT" },

        // ELÉCTRICOS (ELECTRIC)
        { name: "Carga terminada", content: "Hola, tu vehículo ha completado su carga. Por favor, considera moverlo para liberar el espacio.", vehicleType: "ELECTRIC", category: "COMMON" },
        { name: "Cargador desconectado", content: "Hola, te informo que el cargador de tu vehículo ha sido desconectado.", vehicleType: "ELECTRIC", category: "URGENT" },
        { name: "Obstrucción en cargador", content: "Hola, tu vehículo está ocupando un espacio de carga sin estar conectado o ya terminó de cargar.", vehicleType: "ELECTRIC", category: "COMMON" },
        { name: "Error de carga", content: "Atención: Parece haber un error en la estación y tu vehículo no está cargando correctamente.", vehicleType: "ELECTRIC", category: "URGENT" },
        { name: "Carga interrumpida", content: "Atención: La carga de su vehículo se ha interrumpido inesperadamente.", vehicleType: "ELECTRIC", category: "URGENT" },
        { name: "Cable mal conectado", content: "El cable de carga de su vehículo parece no estar bien asegurado o conectado.", vehicleType: "ELECTRIC", category: "COMMON" },
        { name: "Puesto EV requerido", content: "Aviso: Otros conductores necesitan usar este puesto de carga si ya terminó su sesión.", vehicleType: "ELECTRIC", category: "COMMON" },
        { name: "Protección de batería", content: "Aviso: Se recomienda desconectar el vehículo si ya llegó al límite de carga deseado.", vehicleType: "ELECTRIC", category: "COMMON" },
    ]

    console.log('Migrando plantillas...')

    for (const t of templates) {
        const existing = await prisma.notificationTemplate.findFirst({ where: { name: t.name } })
        if (existing) {
            await prisma.notificationTemplate.update({
                where: { id: existing.id },
                data: t
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
