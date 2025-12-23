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
        const vehicles = await db.vehicle.findMany({
            where: {
                userId: session.user.id
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        return NextResponse.json(vehicles)
    } catch (error) {
        console.error("[VEHICLES_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { plate, brand, model, color, type, isElectric } = body

        if (!plate || !brand || !model) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const vehicle = await db.vehicle.create({
            data: {
                plate: plate.toUpperCase(),
                brand,
                model,
                type: type || "CAR",
                color,
                isElectric,
                userId: session.user.id
            }
        })

        return NextResponse.json(vehicle)
    } catch (error) {
        console.error("[VEHICLES_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { id, plate, brand, model, color, type, isElectric } = body

        if (!id) {
            return new NextResponse("Vehicle ID is required", { status: 400 })
        }

        // Verify ownership
        const existingVehicle = await db.vehicle.findUnique({
            where: { id }
        })

        if (!existingVehicle) {
            return new NextResponse("Vehicle not found", { status: 404 })
        }

        if (existingVehicle.userId !== session.user.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const vehicle = await db.vehicle.update({
            where: { id },
            data: {
                plate: plate?.toUpperCase(),
                brand,
                model,
                type: type || "CAR",
                color,
                isElectric
            }
        })

        return NextResponse.json(vehicle)
    } catch (error) {
        console.error("[VEHICLES_PUT]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
