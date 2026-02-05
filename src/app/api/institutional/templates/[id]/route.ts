import { db } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

// PUT: Update a template
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "INSTITUTIONAL" && session.user.role !== "ADMIN")) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const user = await db.user.findUnique({
            where: { id: session.user.id },
            select: { organizationId: true }
        })

        // Verify ownership
        const existing = await db.notificationTemplate.findUnique({
            where: { id: params.id }
        })

        if (!existing || existing.organizationId !== user?.organizationId) {
            return new NextResponse("Not Found or Unauthorized", { status: 404 })
        }

        const body = await req.json()
        const { name, content, vehicleType, category, isActive } = body

        const updated = await db.notificationTemplate.update({
            where: { id: params.id },
            data: {
                name,
                content,
                vehicleType,
                category,
                isActive
            }
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("[INSTITUTIONAL_TEMPLATE_PUT]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// DELETE: Delete a template
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "INSTITUTIONAL" && session.user.role !== "ADMIN")) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const user = await db.user.findUnique({
            where: { id: session.user.id },
            select: { organizationId: true }
        })

        // Verify ownership
        const existing = await db.notificationTemplate.findUnique({
            where: { id: params.id }
        })

        if (!existing || existing.organizationId !== user?.organizationId) {
            return new NextResponse("Not Found or Unauthorized", { status: 404 })
        }

        await db.notificationTemplate.delete({
            where: { id: params.id }
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error("[INSTITUTIONAL_TEMPLATE_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
