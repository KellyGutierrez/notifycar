import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "CAR"
    const isElectric = searchParams.get("isElectric") === "true"
    const publicOrgId = searchParams.get("orgId") // OrgId del vehículo buscado públicamente

    const session = await getServerSession(authOptions)
    const sessionOrgId = session?.user?.organizationId

    // Usamos el orgId del parámetro (público) o el de la sesión (dashboard)
    const organizationId = publicOrgId || sessionOrgId

    try {
        let shouldIncludeGlobal = true;
        if (organizationId) {
            const org = await db.organization.findUnique({
                where: { id: organizationId },
                select: { useGlobalTemplates: true }
            }) as any;
            if (org && org.useGlobalTemplates === false) {
                shouldIncludeGlobal = false;
            }
        }

        const templates = await db.notificationTemplate.findMany({
            where: {
                isActive: true,
                OR: [
                    ...(shouldIncludeGlobal ? [{
                        organizationId: null, // Global templates
                        OR: [
                            { vehicleType: "ALL" },
                            { vehicleType: type },
                            ...(isElectric ? [{ vehicleType: "ELECTRIC" }] : [])
                        ]
                    }] : []),
                    ...(organizationId ? [{
                        organizationId: organizationId, // Organization specific templates
                        OR: [
                            { vehicleType: "ALL" },
                            { vehicleType: type },
                            ...(isElectric ? [{ vehicleType: "ELECTRIC" }] : [])
                        ]
                    }] : [])
                ]
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        return NextResponse.json(templates)
    } catch (error) {
        console.error("Error fetching templates:", error)
        return NextResponse.json({ error: "Error fetching templates" }, { status: 500 })
    }
}
