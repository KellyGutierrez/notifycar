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
            return NextResponse.json({ error: "El usuario no pertenece a ninguna organización" }, { status: 400 })
        }

        let templates = await db.notificationTemplate.findMany({
            where: { organizationId: orgId },
            orderBy: { createdAt: "desc" }
        })

        if (templates.length === 0) {
            const defaultFleetMessages = [
                {
                    name: "📋 Recordatorio de Pago Mensual",
                    content: "Hola {name}, te recordamos que tu cuota mensual de la flota vence pronto. Por favor realiza el pago a tiempo.",
                    category: "COMMON",
                    vehicleType: "ALL"
                },
                {
                    name: "🔧 Mantenimiento Preventivo",
                    content: "Estimado conductor, tu taxi {plate} requiere mantenimiento preventivo. Agenda tu cita en el taller de la flota.",
                    category: "URGENT",
                    vehicleType: "CAR"
                },
                {
                    name: "📄 Documentos por Vencer",
                    content: "Hola {name}, los documentos de tu vehículo {plate} están próximos a vencer. Por favor acércate a la oficina.",
                    category: "URGENT",
                    vehicleType: "ALL"
                },
                {
                    name: "⏰ Recordatorio de Turno",
                    content: "Buen día {name}, te recordamos tu turno programado para hoy. ¡Excelente jornada laboral!",
                    category: "COMMON",
                    vehicleType: "ALL"
                },
                {
                    name: "💰 Bonificación Disponible",
                    content: "¡Felicidades {name}! Tienes una bonificación de desempeño lista. Pasa por administración para reclamarla.",
                    category: "COMMON",
                    vehicleType: "ALL"
                },
                {
                    name: "🚖 No aceptó destino",
                    content: "Estimado {role}, un pasajero reporta que el vehículo {plate} no quiso prestar el servicio al destino indicado. Por favor verificar esta situación.",
                    category: "SERVICIO",
                    vehicleType: "CAR"
                },
                {
                    name: "🗣️ Reporte de trato al usuario",
                    content: "Estimado {role}, se informa que un pasajero reportó un trato inadecuado en el vehículo {plate}. Por favor mantener los estándares de cordialidad de la flota.",
                    category: "SERVICIO",
                    vehicleType: "CAR"
                }
            ]

            await db.notificationTemplate.createMany({
                data: defaultFleetMessages.map(msg => ({
                    ...msg,
                    organizationId: orgId,
                    type: "APP",
                    isActive: true
                }))
            })

            templates = await db.notificationTemplate.findMany({
                where: { organizationId: orgId },
                orderBy: { createdAt: "desc" }
            })
        }

        return NextResponse.json(templates)
    } catch (error) {
        console.error("Error fetching corporate templates:", error)
        return NextResponse.json({ error: "Error del servidor" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || (session.user as any).role !== "CORPORATE") {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const orgId = (session.user as any).organizationId
        const body = await req.json()
        const { name, content, vehicleType, category } = body

        const template = await db.notificationTemplate.create({
            data: {
                name,
                content,
                vehicleType: vehicleType || "ALL",
                category: category || "COMMON",
                organizationId: orgId,
                isActive: true,
                type: "APP"
            }
        })

        return NextResponse.json(template)
    } catch (error) {
        console.error("Error creating template:", error)
        return NextResponse.json({ error: "Error al crear plantilla" }, { status: 500 })
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
        const { id, name, content, vehicleType, category, isActive } = body

        // Verify template belongs to organization
        const existing = await db.notificationTemplate.findFirst({
            where: { id, organizationId: orgId }
        })

        if (!existing) {
            return NextResponse.json({ error: "Plantilla no encontrada" }, { status: 404 })
        }

        const updated = await db.notificationTemplate.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(content && { content }),
                ...(vehicleType && { vehicleType }),
                ...(category && { category }),
                ...(isActive !== undefined && { isActive })
            }
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Error updating template:", error)
        return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || (session.user as any).role !== "CORPORATE") {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const orgId = (session.user as any).organizationId
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "ID requerido" }, { status: 400 })
        }

        // Verify ownership
        const existing = await db.notificationTemplate.findFirst({
            where: { id, organizationId: orgId }
        })

        if (!existing) {
            return NextResponse.json({ error: "No autorizado o no existe" }, { status: 403 })
        }

        await db.notificationTemplate.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting template:", error)
        return NextResponse.json({ error: "Error al eliminar" }, { status: 500 })
    }
}
