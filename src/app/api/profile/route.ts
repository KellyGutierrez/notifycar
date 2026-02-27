import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { db } from "@/lib/db"

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const user = await db.user.findUnique({
            where: { id: session.user.id },
            select: {
                name: true,
                email: true,
                phonePrefix: true,
                phoneNumber: true,
                country: true,
                role: true,
                emailNotifications: true,
                whatsappNotifications: true,
            }
        })
        return NextResponse.json(user)
    } catch (error) {
        console.error("[PROFILE_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const body = await req.json()
        const { name, phonePrefix, phoneNumber, country, emailNotifications, whatsappNotifications } = body

        // Obtener usuario actual para comparar teléfono
        const currentUser = await db.user.findUnique({
            where: { id: session.user.id },
            select: { phonePrefix: true, phoneNumber: true }
        })

        const isPhoneChanging = currentUser?.phonePrefix !== phonePrefix || currentUser?.phoneNumber !== phoneNumber

        if (isPhoneChanging) {
            // 1. Validar que el nuevo teléfono no esté en uso
            const phoneExists = await db.user.findFirst({
                where: {
                    phonePrefix,
                    phoneNumber,
                    NOT: { id: session.user.id }
                }
            })

            if (phoneExists) {
                return new NextResponse("Este número de teléfono ya está en uso", { status: 400 })
            }

            // 2. Validar que el nuevo teléfono haya sido verificado (OTP)
            const identifier = `${phonePrefix}${phoneNumber}`
            const verifiedToken = await (db as any).verificationToken.findFirst({
                where: {
                    identifier,
                    verified: true,
                    expires: { gt: new Date() }
                }
            })

            if (!verifiedToken) {
                return new NextResponse("Debes verificar tu nuevo número de teléfono mediante el código SMS", { status: 400 })
            }

            // Limpiar token usado
            await (db as any).verificationToken.deleteMany({
                where: { identifier }
            })
        }

        const user = await db.user.update({
            where: { id: session.user.id },
            data: {
                name,
                phonePrefix,
                phoneNumber,
                country,
                phoneVerified: isPhoneChanging ? new Date() : undefined,
                emailNotifications,
                whatsappNotifications
            }
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error("[PROFILE_PUT]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
