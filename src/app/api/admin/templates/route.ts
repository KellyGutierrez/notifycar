import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

export async function GET() {
    const session = await getServerSession()

    // Verificación básica de admin (ajustar según tu lógica de roles si es necesario)
    if (!session?.user) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    try {
        const templates = await db.notificationTemplate.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(templates)
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener plantillas" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await getServerSession()
    if (!session?.user) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { name, content, vehicleType, category, type, isActive } = body

        if (!name || !content) {
            return NextResponse.json({ error: "Nombre y contenido son obligatorios" }, { status: 400 })
        }

        const template = await db.notificationTemplate.create({
            data: {
                name,
                content,
                vehicleType: vehicleType || "ALL",
                category: category || "COMMON",
                type: type || "APP",
                isActive: isActive !== undefined ? isActive : true
            }
        })

        return NextResponse.json(template)
    } catch (error) {
        return NextResponse.json({ error: "Error al crear plantilla" }, { status: 500 })
    }
}
