import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const session = await getServerSession()
    if (!session?.user) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { name, content, vehicleType, category, type, isActive, organizationId } = body

        const template = await db.notificationTemplate.update({
            where: { id },
            data: {
                name,
                content,
                vehicleType,
                category,
                type,
                isActive,
                organizationId: organizationId || null
            }
        })

        return NextResponse.json(template)
    } catch (error) {
        console.error("PUT error:", error)
        return NextResponse.json({ error: "Error al actualizar plantilla" }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const session = await getServerSession()
    if (!session?.user) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    try {
        await db.notificationTemplate.delete({
            where: { id }
        })
        return NextResponse.json({ message: "Plantilla eliminada" })
    } catch (error) {
        console.error("DELETE error:", error)
        return NextResponse.json({ error: "Error al eliminar plantilla" }, { status: 500 })
    }
}
