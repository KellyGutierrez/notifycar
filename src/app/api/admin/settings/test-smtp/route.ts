import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const { smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom } = await req.json()

        if (!smtpHost || !smtpUser || !smtpPass) {
            return new NextResponse("Missing SMTP configuration", { status: 400 })
        }

        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort || 587,
            secure: smtpPort === 465, // true for 465, false for other ports
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        })

        // Verify connection configuration
        await transporter.verify()

        // Send a test email
        await transporter.sendMail({
            from: smtpFrom || "noreply@notifycar.com",
            to: session.user.email!,
            subject: "NotifyCar - Prueba de Conexión SMTP",
            text: "¡Felicidades! Tu configuración de correo en NotifyCar funciona correctamente.",
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #06b6d4;">NotifyCar Admin</h2>
                    <p>Este es un correo de prueba para verificar que tu servidor SMTP está bien configurado.</p>
                    <p style="color: #666; font-size: 12px;">Enviado el: ${new Date().toLocaleString()}</p>
                </div>
            `,
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("[SMTP_TEST_ERROR]", error)
        return new NextResponse(error.message || "Error al conectar con el servidor SMTP", { status: 500 })
    }
}
