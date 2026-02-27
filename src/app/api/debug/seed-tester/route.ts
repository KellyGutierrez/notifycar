import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function GET() {
    const email = "tester@notifycar.com"
    const phonePrefix = "+99"
    const phoneNumber = "1234567"
    const plate = "TEST-999"

    try {
        const hashedPassword = await bcrypt.hash("test1234", 10)

        // 1. Upsert User
        const user = await db.user.upsert({
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

        // 2. Upsert Vehicle
        const vehicle = await db.vehicle.upsert({
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

        return NextResponse.json({
            message: "Datos de prueba creados/actualizados con éxito",
            user: { email: user.email, name: user.name },
            vehicle: { plate: vehicle.plate }
        })
    } catch (error: any) {
        console.error("SEED_ERROR", error)
        return new NextResponse(`Error: ${error.message}`, { status: 500 })
    }
}
