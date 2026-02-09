import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: Request) {
    try {
        const { phonePrefix, phoneNumber } = await req.json()

        if (!phonePrefix || !phoneNumber) {
            return new NextResponse("Faltan campos obligatorios", { status: 400 })
        }

        const fullPhoneRaw = `${phonePrefix}${phoneNumber}`
        let fullPhone = fullPhoneRaw.replace(/\D/g, '')

        if (fullPhone.length === 10 && !fullPhone.startsWith('57')) {
            fullPhone = `57${fullPhone}`
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString()
        const expires = new Date(Date.now() + 10 * 60 * 1000)

        await (db as any).verificationToken.upsert({
            where: { identifier_token: { identifier: fullPhoneRaw, token: code } },
            create: {
                identifier: fullPhoneRaw,
                token: code,
                expires
            },
            update: {
                token: code,
                expires,
                verified: false
            }
        })

        let webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL
        const systemSettings = await db.systemSetting.findUnique({ where: { id: "default" } })
        if (systemSettings?.webhookUrl) {
            webhookUrl = systemSettings.webhookUrl
        }

        if (webhookUrl) {
            const message = `🔐 *NotifyCar - Código de Verificación*\n\nTu código para verificar tu número de celular es: *${code}*\n\nEste código vencerá en 10 minutos. No lo compartas con nadie.`

            console.log("🚀 Enviando código de verificación a:", fullPhone);
            console.log("📡 URL Webhook:", webhookUrl);

            try {
                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        notificationId: `verify_${Date.now()}`,
                        plate: "REGISTRO",
                        ownerName: "Nuevo Usuario",
                        phoneNumber: fullPhone,
                        raw_message: message,
                        message: message,
                        content: message,
                        timestamp: new Date()
                    })
                });
                console.log(`📡 Webhook Response Status (${fullPhone}):`, response.status);
            } catch (err) {
                console.error("❌ Error enviando código via WH:", err);
            }
        } else {
            console.warn("⚠️ No se encontró URL de Webhook para enviar la verificación.");
        }

        return NextResponse.json({ message: "Código enviado" })
    } catch (error) {
        console.error("VERIFY_PHONE_SEND_ERROR", error)
        return new NextResponse("Error interno", { status: 500 })
    }
}
