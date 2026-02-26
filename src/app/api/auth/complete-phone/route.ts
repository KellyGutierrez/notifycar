import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return new NextResponse("No autorizado", { status: 401 })
        }

        const { country, phonePrefix, phoneNumber } = await req.json()

        if (!country || !phonePrefix || !phoneNumber) {
            return new NextResponse("Campos incompletos", { status: 400 })
        }

        // Verificar que el número realmente se verificó hace poco
        const identifier = `${phonePrefix}${phoneNumber}`
        const verifiedToken = await (db as any).verificationToken.findFirst({
            where: {
                identifier,
                verified: true,
                expires: { gt: new Date() }
            }
        })

        if (!verifiedToken) {
            return new NextResponse("El número no ha sido verificado", { status: 400 })
        }

        // Actualizar usuario
        await db.user.update({
            where: { id: session.user.id },
            data: {
                country,
                phonePrefix,
                phoneNumber,
                phoneVerified: new Date()
            }
        })

        // Limpiar token
        await (db as any).verificationToken.deleteMany({
            where: { identifier }
        })

        return NextResponse.json({ message: "Perfil actualizado" })
    } catch (error) {
        console.error("COMPLETE_PHONE_ERROR", error)
        return new NextResponse("Error interno", { status: 500 })
    }
}
