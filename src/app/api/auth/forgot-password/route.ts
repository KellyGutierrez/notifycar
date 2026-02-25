import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sendPasswordResetEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(req: Request) {
    try {
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json({ message: "El correo es obligatorio" }, { status: 400 })
        }

        const user = await db.user.findUnique({
            where: { email: email.toLowerCase() },
            select: { id: true, name: true, email: true }
        })

        // Siempre responder igual (no revelar si el correo existe o no)
        if (!user) {
            return NextResponse.json({ message: "Si el correo existe, recibirás un enlace en tu bandeja." })
        }

        // Borrar tokens anteriores para este usuario
        await (db as any).verificationToken.deleteMany({
            where: { identifier: `reset_${user.email}` }
        })

        // Generar token único
        const token = crypto.randomBytes(32).toString("hex")
        const expires = new Date(Date.now() + 30 * 60 * 1000) // 30 minutos

        await (db as any).verificationToken.create({
            data: {
                identifier: `reset_${user.email}`,
                token,
                expires,
                verified: false,
            }
        })

        const resetUrl = `${process.env.NEXTAUTH_URL}/account/reset-password?token=${token}`

        try {
            await sendPasswordResetEmail(user.email!, user.name || "Usuario", resetUrl)
        } catch (emailError) {
            console.error("❌ Error enviando correo de recuperación:", emailError)
            return NextResponse.json({ message: "No se pudo enviar el correo. Contacta al soporte." }, { status: 500 })
        }

        return NextResponse.json({ message: "Si el correo existe, recibirás un enlace en tu bandeja." })
    } catch (error: any) {
        console.error("FORGOT_PASSWORD_ERROR", error)
        return NextResponse.json({ message: "Error interno" }, { status: 500 })
    }
}
