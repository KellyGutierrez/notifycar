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

        const hashedPassword = await hash(password, 10)

        const user = await db.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                country,
                phonePrefix,
                phoneNumber,
                termsAccepted,
            },
        })

        // Remove password from response
        const { password: newUserPassword, ...rest } = user

        return NextResponse.json({ user: rest, message: "User created successfully" }, { status: 201 })
    } catch (error) {
        console.error("REGISTRATION_ERROR", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
