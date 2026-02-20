import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { db } from "@/lib/db"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, password, name, country, phonePrefix, phoneNumber, termsAccepted, captchaToken } = body

        if (!email || !password || !name || !termsAccepted) {
            return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 })
        }

        // 1. VALIDAR RECAPTCHA
        if (!captchaToken) {
            return NextResponse.json({ message: "La verificación de seguridad es obligatoria" }, { status: 400 })
        }

        try {
            const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`;
            const recaptchaRes = await fetch(recaptchaUrl, { method: "POST" });
            const recaptchaData = await recaptchaRes.json();

            if (!recaptchaData.success || (recaptchaData.score !== undefined && recaptchaData.score < 0.3)) {
                console.warn("⚠️ RECAPTCHA_SOFT_FAIL:", recaptchaData);
                // Permitimos el registro aunque falle reCAPTCHA para evitar bloqueos por 'browser-error'
            }
        } catch (error) {
            console.error("RECAPTCHA_ERROR", error);
            // No bloqueamos por error de conexión a Google, pero avisamos
        }

        const exists = await db.user.findUnique({
            where: {
                email,
            },
        })

        if (exists) {
            return NextResponse.json({ message: "El correo ya está registrado" }, { status: 400 })
        }

        // VALIDAR VERIFICACIÓN TELEFÓNICA
        const identifier = `${phonePrefix}${phoneNumber}`
        console.log("🔍 Verificando token para:", identifier);

        // Intentamos buscarlo con y sin el '+' por si acaso
        const identifiers = [identifier, identifier.startsWith('+') ? identifier.substring(1) : `+${identifier}`];

        const verifiedToken = await (db as any).verificationToken.findFirst({
            where: {
                identifier: { in: identifiers },
                verified: true,
                expires: { gt: new Date() }
            },
            orderBy: { createdAt: 'desc' }
        })

        if (!verifiedToken) {
            console.warn("⚠️ No se encontró token de verificación para:", identifier);
            return NextResponse.json({
                message: "Tu número de teléfono no aparece como verificado. Por favor, vuelve a solicitar el código.",
                debug: { identifier, timestamp: new Date() }
            }, { status: 400 })
        }

        const hashedPassword = await hash(password, 10)

        const user = await (db.user as any).create({
            data: {
                email,
                name,
                password: hashedPassword,
                country,
                phonePrefix,
                phoneNumber,
                phoneVerified: new Date(),
                termsAccepted,
            },
        })

        // Limpiar tokens usados
        try {
            await (db as any).verificationToken.deleteMany({
                where: { identifier: { in: identifiers } }
            })
        } catch (e) {
            console.error("Error al limpiar tokens:", e);
        }

        // Remove password from response
        const { password: newUserPassword, ...rest } = user

        return NextResponse.json({ user: rest, message: "User created successfully" }, { status: 201 })
    } catch (error: any) {
        console.error("🚨 REGISTRATION_FULL_ERROR:", error)
        return NextResponse.json({
            message: `Error interno al registrarse: ${error.message || 'Desconocido'}`,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 })
    }
}
