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

    // Si el parámetro orgId está presente en la URL, tiene prioridad absoluta (incluso si está vacío)
    // Esto evita que un usuario corporativo vea sus propios mensajes al buscar una placa ajena
    const organizationId = searchParams.has("orgId") ? (searchParams.get("orgId") || null) : sessionOrgId

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
                        organizationId: null,
                        OR: [
                            { vehicleType: "ALL" },
                            { vehicleType: type },
                            ...(isElectric ? [{ vehicleType: "ELECTRIC" }] : [])
                        ]
                    }] : []),
                    ...(organizationId ? [{
                        organizationId: organizationId,
                        OR: [
                            { vehicleType: "ALL" },
                            { vehicleType: type },
                            ...(isElectric ? [{ vehicleType: "ELECTRIC" }] : [])
                        ]
                    }] : [])
                ]
            },
            orderBy: [
                { vehicleType: 'desc' }, // 'ELECTRIC' is alphabetically after 'ALL', 'CAR', etc. but we want consistent grouping.
                { createdAt: 'asc' }
            ]
        })

        // Ordenamiento manual para asegurar que ELECTRIC vaya primero
        const sortedTemplates = [...templates].sort((a, b) => {
            if (a.vehicleType === "ELECTRIC" && b.vehicleType !== "ELECTRIC") return -1;
            if (a.vehicleType !== "ELECTRIC" && b.vehicleType === "ELECTRIC") return 1;
            return 0;
        });

        return NextResponse.json(sortedTemplates)
    } catch (error) {
        console.error("Error fetching templates:", error)
        return NextResponse.json({ error: "Error fetching templates" }, { status: 500 })
    }
}
