import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "CAR"
    const isElectric = searchParams.get("isElectric") === "true"

    try {
        const templates = await db.notificationTemplate.findMany({
            where: {
                isActive: true,
                OR: [
                    { vehicleType: "ALL" },
                    { vehicleType: type },
                    ...(isElectric ? [{ vehicleType: "ELECTRIC" }] : [])
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
