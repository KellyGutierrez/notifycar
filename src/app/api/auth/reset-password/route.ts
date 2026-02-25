import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hash } from "bcryptjs"

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json()

        if (!token || !password) {
            return NextResponse.json({ message: "Token y contraseña son obligatorios" }, { status: 400 })
        }

        if (password.length < 8) {
            return NextResponse.json({ message: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 })
        }

        // Buscar el token válido
        const resetToken = await (db as any).verificationToken.findFirst({
            where: {
                token,
                expires: { gt: new Date() },
                verified: false,
            }
        })

        if (!resetToken) {
            return NextResponse.json({ message: "El enlace expiró o ya fue usado. Solicita uno nuevo." }, { status: 400 })
        }

        // Extraer el email del identifier (formato: "reset_email@ejemplo.com")
        const email = resetToken.identifier.replace("reset_", "")

        // Actualizar la contraseña
        const hashedPassword = await hash(password, 10)
        await db.user.update({
            where: { email },
            data: { password: hashedPassword }
        })

        // Eliminar el token usado
        await (db as any).verificationToken.delete({
            where: { id: resetToken.id }
        })

        return NextResponse.json({ message: "Contraseña actualizada con éxito" })
    } catch (error: any) {
        console.error("RESET_PASSWORD_ERROR", error)
        return NextResponse.json({ message: "Error interno" }, { status: 500 })
    }
}
