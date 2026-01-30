import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "CAR"
    const isElectric = searchParams.get("isElectric") === "true"

    const session = await getServerSession(authOptions)
    const organizationId = session?.user?.organizationId

    try {
        const templates = await db.notificationTemplate.findMany({
            where: {
                isActive: true,
                OR: [
                    {
                        organizationId: null, // Global templates
                        OR: [
                            { vehicleType: "ALL" },
                            { vehicleType: type },
                            ...(isElectric ? [{ vehicleType: "ELECTRIC" }] : [])
                        ]
                    },
                    ...(organizationId ? [{
                        organizationId, // Organization specific templates
                        OR: [
                            { vehicleType: "ALL" },
                            { vehicleType: type },
                            ...(isElectric ? [{ vehicleType: "ELECTRIC" }] : [])
                        ]
                    }] : [])
                ]
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        return NextResponse.json(templates)
    } catch (error) {
        console.error("Error fetching templates:", error)
        return NextResponse.json({ error: "Error fetching templates" }, { status: 500 })
    }
}
