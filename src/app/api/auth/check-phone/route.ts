import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const phonePrefix = searchParams.get("phonePrefix")
        const phoneNumber = searchParams.get("phoneNumber")

        if (!phonePrefix || !phoneNumber) {
            return new NextResponse("Prefijo y número son requeridos", { status: 400 })
        }

        const user = await db.user.findFirst({
            where: {
                phonePrefix,
                phoneNumber: phoneNumber.replace(/\D/g, '')
            },
            select: { id: true }
        })

        return NextResponse.json({ exists: !!user })
    } catch (error) {
        console.error("[CHECK_PHONE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
