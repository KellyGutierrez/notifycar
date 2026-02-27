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
                plate: plate.toUpperCase().trim()
            },
            select: { id: true }
        })

        return NextResponse.json({ exists: !!vehicle })
    } catch (error) {
        console.error("[CHECK_PLATE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
