import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: Request) {
    try {
        const { phonePrefix, phoneNumber, code } = await req.json()

        if (!phonePrefix || !phoneNumber || !code) {
            return new NextResponse("Campos incompletos", { status: 400 })
        }

        const identifier = `${phonePrefix}${phoneNumber}`

        const verificationToken = await (db as any).verificationToken.findFirst({
            where: {
                identifier,
                token: code,
                expires: { gt: new Date() }
            }
        })

        if (!verificationToken) {
            return new NextResponse("Código inválido o expirado", { status: 400 })
        }

        await (db as any).verificationToken.update({
            where: { id: verificationToken.id },
            data: { verified: true }
        })

        return NextResponse.json({ message: "Teléfono verificado con éxito" })
    } catch (error) {
        console.error("VERIFY_PHONE_CONFIRM_ERROR", error)
        return new NextResponse("Error interno", { status: 500 })
    }
}
