import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    try {
        const organizations = await db.organization.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { users: true, templates: true }
                }
            }
        })
        return NextResponse.json(organizations)
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener organizaciones" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { name, type, isActive, messageWrapper, useGlobalTemplates } = body

        if (!name) return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 })

        const organization = await (db.organization as any).create({
            data: {
                name,
                type: type || "PARKING",
                isActive: isActive !== undefined ? isActive : true,
                messageWrapper,
                useGlobalTemplates: useGlobalTemplates !== undefined ? useGlobalTemplates : true
            }
        })

        return NextResponse.json(organization)
    } catch (error) {
        return NextResponse.json({ error: "Error al crear organización" }, { status: 500 })
    }
}
