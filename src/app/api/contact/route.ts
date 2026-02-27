import { NextResponse } from "next/server"
import { sendContactEmail } from "@/lib/email"

export async function POST(req: Request) {
    try {
        const { name, email, subject, message } = await req.json()

        if (!name || !email || !subject || !message) {
            return new NextResponse("Campos requeridos faltantes", { status: 400 })
        }

        await sendContactEmail({ name, email, subject, message })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error in contact API:", error)
        return new NextResponse("Error al enviar el mensaje", { status: 500 })
    }
}
