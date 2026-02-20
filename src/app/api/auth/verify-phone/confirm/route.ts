import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_ID;

const client = twilio(accountSid, authToken);

export async function POST(req: Request) {
    try {
        const { phonePrefix, phoneNumber, code } = await req.json()

        if (!phonePrefix || !phoneNumber || !code) {
            return new NextResponse("Campos incompletos", { status: 400 })
        }

        // Formatear número para Twilio (E.164)
        let fullPhone = `${phonePrefix}${phoneNumber}`.replace(/\D/g, '')
        if (!fullPhone.startsWith('+')) {
            fullPhone = `+${fullPhone}`
        }

        console.log("🔍 Verificando código con Twilio para:", fullPhone);

        if (!accountSid || !authToken || !verifyServiceSid) {
            console.error("❌ Faltan credenciales de Twilio en .env");
            return new NextResponse("Error de configuración del servidor", { status: 500 })
        }

        // 1. Verificar el código con Twilio
        let check;
        try {
            check = await client.verify.v2
                .services(verifyServiceSid)
                .verificationChecks.create({
                    to: fullPhone,
                    code: code,
                });

            if (check.status !== 'approved') {
                console.warn(`⚠️ Intento de verificación fallido para ${fullPhone}: ${check.status}`);
                return new NextResponse("Código incorrecto o expirado", { status: 400 })
            }

            console.log("✅ Twilio Verify Aprobado para:", fullPhone);
        } catch (twilioError: any) {
            console.error("❌ Error en Twilio Verify Check:", twilioError);
            return new NextResponse(`Error de Twilio: ${twilioError.message}`, { status: 500 })
        }

        // 2. Compatibilidad: Guardar en nuestra DB que este número está verificado
        // Esto permite que register/route.ts siga funcionando sin cambios
        const identifier = `${phonePrefix}${phoneNumber}`
        await (db as any).verificationToken.create({
            data: {
                identifier,
                token: check.sid, // Usamos el SID de Twilio como token único
                expires: new Date(Date.now() + 20 * 60 * 1000), // 20 min validez
                verified: true
            }
        })

        return NextResponse.json({ message: "Teléfono verificado con éxito" })
    } catch (error) {
        console.error("VERIFY_PHONE_CONFIRM_ERROR", error)
        return new NextResponse("Error interno", { status: 500 })
    }
}
