import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const configs = await db.emergencyConfig.findMany({
        orderBy: { country: 'asc' }
    })
    return NextResponse.json(configs)
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const body = await req.json()
        const { country, police, transit, emergency } = body

        if (!country) return new NextResponse("Country required", { status: 400 })

        const config = await db.emergencyConfig.upsert({
            where: { country },
            update: { police, transit, emergency },
            create: { country, police, transit, emergency }
        })

        return NextResponse.json(config)
    } catch (error) {
        console.error(error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) return new NextResponse("Id required", { status: 400 })

    await db.emergencyConfig.delete({ where: { id } })
    return new NextResponse("OK")
}
