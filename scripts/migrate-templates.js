const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const templates = [
        // COMUNES
        { name: "Mal estacionado", content: "Hola, tu vehículo está obstruyendo el paso o mal estacionado.", vehicleType: "ALL", category: "COMMON" },
        { name: "Alarma sonando", content: "Hola, la alarma de tu vehículo se ha activado.", vehicleType: "ALL", category: "COMMON" },
        { name: "Grúa/Peligro", content: "¡Atención! Tu vehículo corre peligro de ser remolcado o está en una situación de riesgo.", vehicleType: "ALL", category: "URGENT" },

        // AUTOS
        { name: "Luces encendidas", content: "Hola, te informo que dejaste las luces de tu vehículo encendidas.", vehicleType: "CAR", category: "COMMON" },
        { name: "Ventana abierta", content: "Hola, tienes una ventana de tu vehículo abierta.", vehicleType: "CAR", category: "COMMON" },

        // MOTOS
        { name: "Llaves puestas", content: "Hola, olvidaste las llaves puestas en el switch de tu moto.", vehicleType: "MOTORCYCLE", category: "URGENT" },
        { name: "Casco olvidado", content: "Hola, dejaste el casco colgado o sobre la moto.", vehicleType: "MOTORCYCLE", category: "COMMON" },
        { name: "Posición inestable", content: "Tu moto está en una posición inestable o mal apoyada.", vehicleType: "MOTORCYCLE", category: "URGENT" },
        { name: "Funda suelta", content: "La funda o carpa de tu moto se está soltando por el viento.", vehicleType: "MOTORCYCLE", category: "COMMON" },
        { name: "Derrame/Aceite", content: "Parece que tu moto está goteando aceite o algún líquido.", vehicleType: "MOTORCYCLE", category: "URGENT" },

        // ELÉCTRICOS
        { name: "Carga terminada", content: "Hola, tu vehículo ha completado su carga. Por favor, considera moverlo para liberar el espacio.", vehicleType: "ELECTRIC", category: "COMMON" },
        { name: "Cargador desconectado", content: "Hola, te informo que el cargador de tu vehículo ha sido desconectado.", vehicleType: "ELECTRIC", category: "URGENT" },
        { name: "Obstrucción en cargador", content: "Hola, tu vehículo está ocupando un espacio de carga sin estar conectado o ya terminó de cargar.", vehicleType: "ELECTRIC", category: "COMMON" },
        { name: "Error de carga", content: "Atención: Parece haber un error en la estación y tu vehículo no está cargando correctamente.", vehicleType: "ELECTRIC", category: "URGENT" },
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
