import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import twilio from "twilio"

export async function POST(req: Request) {
    try {
        const { phonePrefix, phoneNumber, email } = await req.json()

        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_ID;

        if (!phonePrefix || !phoneNumber) {
            return new NextResponse("Faltan campos obligatorios", { status: 400 })
        }

        // Formatear número para Twilio (E.164: +CCNumber)
        let digits = `${phonePrefix}${phoneNumber}`.replace(/\D/g, '')
        const fullPhone = `+${digits}`

        console.log("🚀 Enviando verificación Twilio a:", fullPhone);

        if (!accountSid || !authToken || !verifyServiceSid) {
            console.error("❌ ERROR: Faltan credenciales de Twilio en .env o no cargaron correctamente.");
            return new NextResponse("Error de configuración del servidor: Faltan credenciales", { status: 500 })
        }

        const client = twilio(accountSid, authToken);

        // 1. Iniciar verificación en Twilio
        try {
            const verification = await client.verify.v2
                .services(verifyServiceSid)
                .verifications.create({
                    channel: "sms",
                    to: fullPhone,
                });

            console.log("📡 Twilio Verify SID:", verification.sid, "| Status:", verification.status);
        } catch (twilioError: any) {
            console.error("❌ ERROR DIRECTO DE TWILIO:", {
                code: twilioError.code,
                message: twilioError.message,
                status: twilioError.status,
                moreInfo: twilioError.moreInfo
            });
            return new NextResponse(`Error de Twilio: ${twilioError.message}`, { status: 500 })
        }

        // 2. Notificar a n8n para el Email (opcional)
        let webhookUrl = process.env.VERIFICATION_WEBHOOK_URL || "https://n8n.vps.rowell.digital/webhook/10284dc7-1e8f-427e-99c6-255433c98e6d"

        if (webhookUrl && email) {
            try {
                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        notificationId: `verify_req_${Date.now()}`,
                        plate: "REGISTRO",
                        ownerName: "Nuevo Usuario",
                        phoneNumber: fullPhone,
                        message: "Se ha enviado un código de seguridad a tu celular vía SMS.",
                        email: email || null,
                        timestamp: new Date()
                    })
                });
            } catch (err) {
                console.error("⚠️ Error silencioso notificando a n8n:", err);
            }
        }

        return NextResponse.json({ message: "Código enviado" })
    } catch (error: any) {
        console.error("VERIFY_PHONE_SEND_ERROR", error)
        return new NextResponse(`Error interno: ${error.message}`, { status: 500 })
    }
}
