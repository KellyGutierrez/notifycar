import { db } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "INSTITUTIONAL" && session.user.role !== "ADMIN")) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const user = await db.user.findUnique({
            where: { id: session.user.id },
            select: { organizationId: true }
        })

        if (!user?.organizationId) {
            return new NextResponse("No organization found", { status: 404 })
        }

        const org = await db.organization.findUnique({
            where: { id: user.organizationId },
            select: { publicToken: true }
        })

        return NextResponse.json(org)
    } catch (error) {
        console.error("[INSTITUTIONAL_SETTINGS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
