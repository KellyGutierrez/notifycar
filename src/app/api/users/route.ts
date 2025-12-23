import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { db } from "@/lib/db"

async function checkAdmin() {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
        return false
    }
    return true
}

export async function GET() {
    if (!(await checkAdmin())) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const users = await db.user.findMany({
            include: {
                _count: {
                    select: { vehicles: true }
                }
            },
            orderBy: { createdAt: "desc" }
        })
        return NextResponse.json(users)
    } catch (error) {
        console.error("[USERS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PUT(req: Request) {
    if (!(await checkAdmin())) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const body = await req.json()
        const { id, name, email, role, country, phonePrefix, phoneNumber } = body

        if (!id) {
            return new NextResponse("User ID is required", { status: 400 })
        }

        const user = await db.user.update({
            where: { id },
            data: {
                name,
                email,
                role,
                country,
                phonePrefix,
                phoneNumber
            }
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error("[USERS_PUT]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(req: Request) {
    if (!(await checkAdmin())) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return new NextResponse("User ID is required", { status: 400 })
        }

        await db.user.delete({
            where: { id }
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error("[USERS_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
