const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    try {
        console.log("Conectando a la base de datos...")
        const userCount = await prisma.user.count()
        console.log(`Conexión exitosa.Usuarios encontrados: ${userCount} `)

        // Intentar leer un usuario para ver si falla por columnas faltantes
        const user = await prisma.user.findFirst()
        if (user) {
            console.log("Usuario encontrado:", JSON.stringify(user, null, 2))
        } else {
            console.log("No hay usuarios en la BD.")
        }

        // Test simple de query raw para ver columnas si es posible, o confiar en el schema del cliente.
        // Si prisma client está desactualizado, esto no fallará aquí, fallará al runtime real.

    } catch (e) {
        console.error("Error conectando o consultando la BD:", e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
