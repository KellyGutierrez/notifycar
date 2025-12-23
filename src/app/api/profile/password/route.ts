import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const body = await req.json()
        const { currentPassword, newPassword } = body

        const user = await db.user.findUnique({
            where: { id: session.user.id }
        })

        if (!user || !user.password) {
            return new NextResponse("User not found", { status: 404 })
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

        if (!isPasswordValid) {
            return new NextResponse("Contraseña actual incorrecta", { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12)

        await db.user.update({
            where: { id: session.user.id },
            data: {
                password: hashedPassword
            }
        })

        return new NextResponse("Password updated successfully", { status: 200 })
    } catch (error) {
        console.error("[PASSWORD_PUT]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
