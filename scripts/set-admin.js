const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function promoteToAdmin(email) {
    try {
        const user = await prisma.user.update({
            where: { email: email },
            data: { role: 'ADMIN' },
        })
        console.log(`\n✅ EXITO: El usuario ${email} ahora es ADMINISTRADOR.`)
        console.log("Ya puedes ingresar a http://localhost:3000/admin\n")
    } catch (error) {
        console.error("\n❌ ERROR: No se pudo promover al usuario.")
        console.log("Asegúrate de que el correo sea correcto y ya estés registrado.\n")

        const users = await prisma.user.findMany({ select: { email: true } })
        if (users.length > 0) {
            console.log("Usuarios registrados actualmente:")
            users.forEach(u => console.log(`- ${u.email}`))
        } else {
            console.log("No hay usuarios registrados en la base de datos.")
        }
    } finally {
        await prisma.$disconnect()
    }
}

async function listUsers() {
    try {
        const users = await prisma.user.findMany({ select: { email: true, role: true } })
        if (users.length > 0) {
            console.log("\nUsuarios registrados actualmente:")
            users.forEach(u => console.log(`- ${u.email} [${u.role}]`))
        } else {
            console.log("\nNo hay usuarios registrados en la base de datos.")
        }
    } finally {
        await prisma.$disconnect()
    }
}

const emailToPromote = process.argv[2]
if (!emailToPromote) {
    console.log("\nUso: node set-admin.js tu_correo@ejemplo.com")
    listUsers()
} else {
    promoteToAdmin(emailToPromote)
}

