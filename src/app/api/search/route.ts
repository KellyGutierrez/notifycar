import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const plate = searchParams.get("plate")

        if (!plate) {
            return new NextResponse("Plate is required", { status: 400 })
        }

        const vehicle = await db.vehicle.findUnique({
            where: {
                plate: plate.toUpperCase()
            }
        })

        if (!vehicle) {
            return NextResponse.json({ found: false })
        }

        return NextResponse.json({
            found: true,
            vehicle: {
                id: vehicle.id,
                brand: vehicle.brand,
                model: vehicle.model,
                color: vehicle.color,
                type: vehicle.type,
                isElectric: vehicle.isElectric
            }
        })
    } catch (error) {
        console.error("[SEARCH_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
