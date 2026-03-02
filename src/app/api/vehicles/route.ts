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
            return new NextResponse("Faltan campos obligatorios (Placa, Marca, Modelo)", { status: 400 })
        }

        const normalizedPlate = plate.toUpperCase().trim()

        // Verificar si la placa ya existe
        const existingPlate = await db.vehicle.findUnique({
            where: { plate: normalizedPlate }
        })

        if (existingPlate) {
            return new NextResponse("Esta placa ya está registrada con otro vehículo", { status: 400 })
        }

        const vehicle = await db.vehicle.create({
            data: {
                plate: normalizedPlate,
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

        if (existingVehicle.userId !== session.user.id && session.user.role !== "ADMIN") {
            return new NextResponse("No autorizado", { status: 401 })
        }

        const normalizedPlate = plate?.toUpperCase().trim()

        // Si la placa cambia, verificar que la nueva no esté en uso
        if (normalizedPlate && normalizedPlate !== existingVehicle.plate) {
            const plateExists = await db.vehicle.findUnique({
                where: { plate: normalizedPlate }
            })

            if (plateExists) {
                return new NextResponse("Esta placa ya está registrada con otro vehículo", { status: 400 })
            }
        }

        const vehicle = await db.vehicle.update({
            where: { id },
            data: {
                plate: normalizedPlate,
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

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return new NextResponse("Vehicle ID required", { status: 400 })
        }

        const vehicle = await db.vehicle.findUnique({ where: { id } })
        if (!vehicle) {
            return new NextResponse("Vehicle not found", { status: 404 })
        }

        // Allow owner OR Admin
        if (vehicle.userId !== session.user.id && session.user.role !== "ADMIN") {
            return new NextResponse("No autorizado", { status: 401 })
        }

        await db.vehicle.delete({ where: { id } })
        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error("[VEHICLES_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
