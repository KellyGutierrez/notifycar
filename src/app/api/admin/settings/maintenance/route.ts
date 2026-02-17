import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
    try {
        const settings = await db.systemSetting.findUnique({
            where: { id: "default" },
            select: { maintenanceMode: true }
        })

        return NextResponse.json({
            maintenanceMode: settings?.maintenanceMode || false
        })
    } catch (error) {
        console.error("[MAINTENANCE_CHECK]", error)
        return NextResponse.json({ maintenanceMode: false })
    }
}
