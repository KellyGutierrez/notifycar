import { db } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

// GET: Fetch templates for the institutional organization
export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "INSTITUTIONAL" && session.user.role !== "ADMIN")) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const user = await db.user.findUnique({
            where: { id: session.user.id },
            select: { organizationId: true }
        })

        if (!user?.organizationId) {
            return NextResponse.json([])
        }

        const templates = await db.notificationTemplate.findMany({
            where: {
                organizationId: user.organizationId
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return NextResponse.json(templates)
    } catch (error) {
        console.error("[INSTITUTIONAL_TEMPLATES_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// POST: Create a new template for the organization
export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "INSTITUTIONAL" && session.user.role !== "ADMIN")) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const user = await db.user.findUnique({
            where: { id: session.user.id },
            select: { organizationId: true }
        })

        if (!user?.organizationId) {
            return new NextResponse("No organization found", { status: 400 })
        }

        const body = await req.json()
        const { name, content, vehicleType, category, isActive } = body

        const template = await db.notificationTemplate.create({
            data: {
                name,
                content,
                vehicleType: vehicleType || "ALL",
                category: category || "COMMON",
                isActive: isActive !== undefined ? isActive : true,
                organizationId: user.organizationId
            }
        })

        return NextResponse.json(template)
    } catch (error) {
        console.error("[INSTITUTIONAL_TEMPLATES_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
