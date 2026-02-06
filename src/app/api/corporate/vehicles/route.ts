import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "CORPORATE" && session.user.role !== "ADMIN")) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        // Obtenemos el ID de la organización del usuario
        const user = await db.user.findUnique({
            where: { id: session.user.id },
            select: { organizationId: true }
        })

        if (!user?.organizationId && session.user.role !== "ADMIN") {
            return NextResponse.json([])
        }

        const vehicles = await db.vehicle.findMany({
            where: {
                // @ts-ignore
                organizationId: user?.organizationId || undefined
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        return NextResponse.json(vehicles)
    } catch (error) {
        console.error("[CORPORATE_VEHICLES_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== "CORPORATE" && session.user.role !== "ADMIN")) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const user = await db.user.findUnique({
            where: { id: session.user.id },
            select: { organizationId: true }
        })

        if (!user?.organizationId) {
            return new NextResponse("No tienes una organización asignada", { status: 400 })
        }

        const body = await req.json()
        const { plate, brand, model, color, type, isElectric, ownerName, ownerPhone, driverName, driverPhone } = body

        if (!plate || !brand || !model) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        // Creamos el vehículo y lo ligamos a la organización
        const vehicle = await db.vehicle.create({
            data: {
                plate: plate.toUpperCase(),
                brand,
                model,
                type: type || "CAR",
                color,
                isElectric,
                ownerName,
                ownerPhone,
                driverName,
                driverPhone,
                userId: session.user.id, // El administrador corporativo es el dueño inicial
                // @ts-ignore
                organizationId: user.organizationId
            }
        })

        return NextResponse.json(vehicle)
    } catch (error) {
        console.error("[CORPORATE_VEHICLES_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== "CORPORATE" && session.user.role !== "ADMIN")) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { id, plate, brand, model, color, type, isElectric, ownerName, ownerPhone, driverName, driverPhone } = body

        if (!id) {
            return new NextResponse("Missing vehicle ID", { status: 400 })
        }

        console.log("📝 [DEBUG] Updating vehicle:", id, { plate, ownerPhone, driverPhone });

        const vehicle = await db.vehicle.update({
            where: { id },
            data: {
                ...(plate && { plate: plate.toUpperCase() }),
                ...(brand && { brand }),
                ...(model && { model }),
                ...(type && { type }),
                ...(color !== undefined && { color }),
                ...(isElectric !== undefined && { isElectric }),
                ...(ownerName !== undefined && { ownerName }),
                ...(ownerPhone !== undefined && { ownerPhone }),
                ...(driverName !== undefined && { driverName }),
                ...(driverPhone !== undefined && { driverPhone }),
            }
        })

        console.log("✅ [DEBUG] Vehicle updated successfully");
        return NextResponse.json(vehicle)
    } catch (error: any) {
        console.error("[CORPORATE_VEHICLES_PUT]", error)
        return new NextResponse(`Error al actualizar: ${error.message}`, { status: 500 })
    }
}
