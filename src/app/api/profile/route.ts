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
        const { name, phonePrefix, phoneNumber, country } = body

        const user = await db.user.update({
            where: { id: session.user.id },
            data: {
                name,
                phonePrefix,
                phoneNumber,
                country
            }
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error("[PROFILE_PUT]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
