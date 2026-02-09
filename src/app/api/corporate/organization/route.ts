import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || (session.user as any).role !== "CORPORATE") {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const orgId = (session.user as any).organizationId
        if (!orgId) {
            return NextResponse.json({ error: "No perteneces a una organización" }, { status: 400 })
        }

        const organization = await db.organization.findUnique({
            where: { id: orgId }
        })

        return NextResponse.json(organization)
    } catch (error) {
        console.error("Error fetching corporate org:", error)
        return NextResponse.json({ error: "Error del servidor" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || (session.user as any).role !== "CORPORATE") {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const orgId = (session.user as any).organizationId
        const body = await req.json()
        const { messageWrapper, name, useGlobalTemplates } = body

        const updated = await (db.organization as any).update({
            where: { id: orgId },
            data: {
                ...(messageWrapper !== undefined && { messageWrapper }),
                ...(name && { name }),
                ...(useGlobalTemplates !== undefined && { useGlobalTemplates })
            }
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Error updating corporate org:", error)
        return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
    }
}
