import nodemailer from "nodemailer"
import { db } from "@/lib/db"

async function getTransporter() {
    // Intentar leer configuración SMTP desde la base de datos
    let smtpConfig = {
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 587,
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
        from: process.env.SMTP_FROM || "noreply@notifycar.com",
    }

    try {
        const settings = await (db as any).systemSetting.findUnique({
            where: { id: "default" },
            select: { smtpHost: true, smtpPort: true, smtpUser: true, smtpPass: true, smtpFrom: true }
        })
        if (settings?.smtpHost && settings?.smtpUser) {
            smtpConfig = {
                host: settings.smtpHost,
                port: settings.smtpPort || 587,
                user: settings.smtpUser,
                pass: settings.smtpPass || "",
                from: settings.smtpFrom || "noreply@notifycar.com",
            }
        }
    } catch (e) {
        console.warn("⚠️ No se pudo leer SMTP desde DB, usando .env")
    }

    return nodemailer.createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: smtpConfig.port === 465,
        auth: {
            user: smtpConfig.user,
            pass: smtpConfig.pass,
        },
    })
}

export async function sendPasswordResetEmail(email: string, name: string, resetUrl: string) {
    const transporter = await getTransporter()

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Recuperar Contraseña - NotifyCar</title>
    </head>
    <body style="font-family: Arial, sans-serif; background:#f9fafb; margin:0; padding:20px;">
      <div style="max-width:520px; margin:0 auto; background:white; border-radius:16px; padding:40px; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <img src="${process.env.NEXTAUTH_URL}/logo.png" alt="NotifyCar" style="height:64px; margin-bottom:24px;" />
        <h2 style="color:#111827; margin:0 0 8px;">Recuperar contraseña</h2>
        <p style="color:#6b7280; margin:0 0 24px;">Hola <strong>${name}</strong>, recibimos una solicitud para restablecer tu contraseña.</p>
        <a href="${resetUrl}" style="display:inline-block; background:#16a34a; color:white; text-decoration:none; padding:14px 28px; border-radius:10px; font-weight:bold; font-size:16px; margin-bottom:24px;">
          Restablecer contraseña
        </a>
        <p style="color:#9ca3af; font-size:13px; margin:0;">Este enlace expira en <strong>30 minutos</strong>. Si no solicitaste esto, ignora este correo.</p>
        <hr style="border:none; border-top:1px solid #f3f4f6; margin:24px 0 16px;" />
        <p style="color:#d1d5db; font-size:12px; margin:0;">NotifyCar · La red de conductores conectados</p>
      </div>
    </body>
    </html>
    `

    await transporter.sendMail({
        from: `"NotifyCar" <${process.env.SMTP_FROM || "noreply@notifycar.com"}>`,
        to: email,
        subject: "Restablecer tu contraseña - NotifyCar",
        html,
    })
}
