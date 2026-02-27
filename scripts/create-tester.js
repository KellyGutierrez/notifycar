const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
    const email = "tester@notifycar.com"
    const phonePrefix = "+99"
    const phoneNumber = "1234567"
    const plate = "TEST-999"

    try {
        console.log("🚀 Iniciando creación de usuario de prueba...");

        // 1. Crear o encontrar usuario
        const hashedPassword = await bcrypt.hash("test1234", 10)
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                name: "Usuario de Prueba",
                phonePrefix,
                phoneNumber,
                phoneVerified: new Date(),
                password: hashedPassword
            },
            create: {
                email,
                name: "Usuario de Prueba",
                phonePrefix,
                phoneNumber,
                phoneVerified: new Date(),
                password: hashedPassword,
                role: "USER"
            }
        })

        console.log("✅ Usuario OK:", user.email);

        // 2. Crear vehículo
        const vehicle = await prisma.vehicle.upsert({
            where: { plate },
            update: {
                brand: "PRUEBA",
                model: "MASTER",
                userId: user.id
            },
            create: {
                plate,
                brand: "PRUEBA",
                model: "MASTER",
                type: "CAR",
                userId: user.id
            }
        })

        console.log("✅ Vehículo OK:", vehicle.plate);
        console.log("\n🎊 DATOS DE ACCESO:");
        console.log("📧 Email:", email);
        console.log("🔑 Password:", "test1234");
        console.log("🚗 Placa Bypass:", plate);

    } catch (error) {
        console.error("❌ ERROR:", error);
    } finally {
        await prisma.$disconnect()
    }
}

main()
