import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.organizationId) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const operators = await db.user.findMany({
        where: {
            organizationId: session.user.organizationId,
            role: "OPERATOR"
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
        }
    })

    return NextResponse.json(operators)
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.organizationId) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const body = await req.json()
        const { name, email, password } = body

        if (!name || !email || !password) {
            return new NextResponse("Missing fields", { status: 400 })
        }

        const existingUser = await db.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return new NextResponse("User already exists", { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const operator = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "OPERATOR",
                organizationId: session.user.organizationId
            }
        })

        return NextResponse.json(operator)
    } catch (error) {
        console.error(error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.organizationId) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) return new NextResponse("Missing ID", { status: 400 })

    await db.user.delete({
        where: {
            id,
            organizationId: session.user.organizationId,
            role: "OPERATOR"
        }
    })

    return new NextResponse("OK")
}
