import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const email = searchParams.get("email")

        if (!email) {
            return new NextResponse("Email es requerido", { status: 400 })
        }

        const user = await db.user.findUnique({
            where: { email: email.toLowerCase() },
            select: { id: true }
        })

        return NextResponse.json({ exists: !!user })
    } catch (error) {
        console.error("[CHECK_EMAIL]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
