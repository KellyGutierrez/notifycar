import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")

    if (!token) {
        return new NextResponse("Token is required", { status: 400 })
    }

    try {
        const organization = await db.organization.findUnique({
            where: { publicToken: token },
            select: {
                id: true,
                name: true,
                logo: true,
                type: true,
                messageWrapper: true
            }
        })

        if (!organization) {
            return new NextResponse("Invalid token", { status: 404 })
        }

        const templates = await db.notificationTemplate.findMany({
            where: {
                organizationId: organization.id,
                isActive: true
            },
            orderBy: {
                name: "asc"
            }
        })

        return NextResponse.json({
            organization,
            templates
        })
    } catch (error) {
        console.error("[PUBLIC_ZONE_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
