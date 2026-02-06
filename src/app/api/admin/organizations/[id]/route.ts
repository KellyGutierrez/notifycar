import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { name, type, isActive, messageWrapper, useGlobalTemplates } = body

        const organization = await (db.organization as any).update({
            where: { id },
            data: {
                name,
                type,
                isActive,
                messageWrapper,
                useGlobalTemplates
            }
        })

        return NextResponse.json(organization)
    } catch (error) {
        return NextResponse.json({ error: "Error al actualizar organización" }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    try {
        await db.organization.delete({ where: { id } })
        return NextResponse.json({ message: "Organización eliminada" })
    } catch (error) {
        return NextResponse.json({ error: "Error al eliminar organización" }, { status: 500 })
    }
}
