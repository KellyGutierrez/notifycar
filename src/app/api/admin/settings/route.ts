import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        let settings = await db.systemSetting.findUnique({
            where: { id: "default" }
        })

        if (!settings) {
            settings = await db.systemSetting.create({
                data: { id: "default" }
            })
        }

        return NextResponse.json(settings)
    } catch (error) {
        console.error("[SETTINGS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const body = await req.json()
        const { systemName, maintenanceMode, allowRegistration, googleAnalyticsId } = body

        const settings = await db.systemSetting.upsert({
            where: { id: "default" },
            update: {
                systemName,
                maintenanceMode,
                allowRegistration,
                googleAnalyticsId
            },
            create: {
                id: "default",
                systemName,
                maintenanceMode,
                allowRegistration,
                googleAnalyticsId
            }
        })

        return NextResponse.json(settings)
    } catch (error) {
        console.error("[SETTINGS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
