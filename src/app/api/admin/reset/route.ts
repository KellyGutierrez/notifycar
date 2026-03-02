import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { db } from "@/lib/db"

async function checkAdmin() {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
        return false
    }
    return true
}

export async function POST(req: Request) {
    if (!(await checkAdmin())) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const { action } = await req.json()

        if (action === "DELETE_ALL_VEHICLES") {
            await db.vehicle.deleteMany({})
            return NextResponse.json({ message: "Todos los vehículos han sido eliminados" })
        }

        if (action === "DELETE_ALL_USERS") {
            // Delete all users EXCEPT the current admin and any other admins
            await db.user.deleteMany({
                where: {
                    role: { not: "ADMIN" }
                }
            })
            return NextResponse.json({ message: "Todos los usuarios (no admins) han sido eliminados" })
        }

        if (action === "DELETE_ALL_NOTIFICATIONS") {
            await db.notification.deleteMany({})
            return NextResponse.json({ message: "Todas las notificaciones han sido eliminadas" })
        }

        return new NextResponse("Invalid action", { status: 400 })
    } catch (error) {
        console.error("[RESET_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
