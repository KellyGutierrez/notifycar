import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { db } from "@/lib/db"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, password, name, country, phonePrefix, phoneNumber, termsAccepted } = body

        if (!email || !password || !name || !termsAccepted) {
            return new NextResponse("Faltan campos obligatorios", { status: 400 })
        }

        const exists = await db.user.findUnique({
            where: {
                email,
            },
        })

        if (exists) {
            return new NextResponse("El correo ya está registrado", { status: 400 })
        }

        // VALIDAR VERIFICACIÓN TELEFÓNICA
        const identifier = `${phonePrefix}${phoneNumber}`
        const verifiedToken = await (db as any).verificationToken.findFirst({
            where: {
                identifier,
                verified: true,
                expires: { gt: new Date() }
            }
        })

        if (!verifiedToken) {
            return new NextResponse("El número de teléfono no ha sido verificado", { status: 400 })
        }

        const hashedPassword = await hash(password, 10)

        const user = await (db.user as any).create({
            data: {
                email,
                name,
                password: hashedPassword,
                country,
                phonePrefix,
                phoneNumber,
                phoneVerified: new Date(),
                termsAccepted,
            },
        })

        // Limpiar tokens usados
        await (db as any).verificationToken.deleteMany({
            where: { identifier }
        })

        // Remove password from response
        const { password: newUserPassword, ...rest } = user

        return NextResponse.json({ user: rest, message: "User created successfully" }, { status: 201 })
    } catch (error) {
        console.error("REGISTRATION_ERROR", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
