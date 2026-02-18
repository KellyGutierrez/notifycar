import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { db } from "@/lib/db"

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        // Fetch notifications related to the user's vehicles or created by the user
        // For now, let's fetch notifications for vehicles owned by the current user
        const notifications = await db.notification.findMany({
            where: {
                vehicle: {
                    userId: session.user.id
                }
            },
            include: {
                vehicle: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return NextResponse.json(notifications)
    } catch (error) {
        console.error("[NOTIFICATIONS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        let { vehicleId, content, type, templateId, recipientRole } = body

        if (!vehicleId || !content) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        // ... (cooldown logic remains)
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
        const lastNotification = await db.notification.findFirst({
            where: {
                vehicleId,
                createdAt: {
                    gte: tenMinutesAgo
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        if (lastNotification) {
            const timeLeft = Math.ceil((lastNotification.createdAt.getTime() + 10 * 60 * 1000 - Date.now()) / 1000 / 60)
            return new NextResponse(`Este vehículo ya recibió un mensaje recientemente. Por favor, espera ${timeLeft} minuto(s) antes de enviar otro.`, { status: 429 })
        }

        // Obtener el vehículo para incluir la placa en el mensaje y saber de qué país es el dueño
        const vehicle = await db.vehicle.findUnique({
            where: { id: vehicleId },
            include: {
                user: {
                    select: {
                        name: true,
                        country: true,
                        phonePrefix: true,
                        phoneNumber: true
                    }
                }
            }
        }) as any;

        if (!vehicle) {
            return new NextResponse("Vehículo no encontrado", { status: 404 });
        }

        // Determine target contact and name based on role
        // Default values from the main user
        let targetName = vehicle.user?.name || "Usuario"
        let targetPhone = `${vehicle.user?.phonePrefix || ""}${vehicle.user?.phoneNumber || ""}`

        console.log("🔍 [DEBUG] Vehicle Data:", {
            organizationId: vehicle.organizationId,
            ownerPhone: vehicle.ownerPhone,
            driverPhone: vehicle.driverPhone
        });

        // If it's a corporate vehicle and no role is specified, we try to find a direct contact
        if (!recipientRole && vehicle.organizationId) {
            if (vehicle.driverPhone) {
                recipientRole = "DRIVER";
                console.log("ℹ️ Corporate vehicle detected, defaulting to DRIVER contact");
            } else if (vehicle.ownerPhone) {
                recipientRole = "OWNER";
                console.log("ℹ️ Corporate vehicle detected, defaulting to OWNER contact");
            }
        }

        if (recipientRole === "OWNER" && vehicle.ownerPhone) {
            targetPhone = vehicle.ownerPhone
            targetName = vehicle.ownerName || targetName || "Propietario"
            console.log("✅ Target: OWNER", targetPhone);
        } else if (recipientRole === "DRIVER" && vehicle.driverPhone) {
            targetPhone = vehicle.driverPhone
            targetName = vehicle.driverName || targetName || "Conductor"
            console.log("✅ Target: DRIVER", targetPhone);
        } else {
            console.log("ℹ️ Final target: User phone", targetPhone);
        }

        // Buscar números de emergencia según el país
        let emergency = { police: "123", transit: "123", general: "123" };
        const userCountry = (vehicle.user.country || "").trim().toUpperCase();

        if (userCountry) {
            const config = await db.emergencyConfig.findUnique({
                where: { country: userCountry }
            });

            if (config) {
                emergency = {
                    police: config.police,
                    transit: config.transit,
                    general: config.emergency
                };
            } else {
                if (userCountry === "CO" || userCountry === "COLOMBIA") {
                    emergency = { police: "123", transit: "127", general: "123" };
                } else if (userCountry === "MX" || userCountry === "MEXICO" || userCountry === "MÉXICO") {
                    emergency = { police: "911", transit: "911", general: "911" };
                }
            }
        }

        const vehicleIcon = vehicle.type === 'MOTORCYCLE' ? '🏍️' : '🚘';
        const vehicleTypeLabel = vehicle.type === 'MOTORCYCLE' ? 'MOTOCICLETA' : 'VEHÍCULO';
        const electricTag = vehicle.isElectric ? '⚡ *VEHÍCULO ELÉCTRICO*' : '';

        // 1. Intentar obtener wrapper de la organización vinculada
        let wrapper = "";

        // Primero, si el vehículo pertenece a una organización, intentamos usar su wrapper
        if (vehicle.organizationId) {
            const org = await db.organization.findUnique({
                where: { id: vehicle.organizationId },
                select: { messageWrapper: true }
            });
            if (org?.messageWrapper) {
                wrapper = org.messageWrapper;
            }
        }

        // 2. Si no hay wrapper de org (o el vehículo no tiene org), buscar el global en settings
        if (!wrapper) {
            const settings = await db.systemSetting.findUnique({ where: { id: "default" } });
            if (settings?.messageWrapper) {
                wrapper = settings.messageWrapper;
            }
        }

        // 3. Fallback al diseño por defecto si todo lo anterior falla
        if (!wrapper) {
            wrapper = `Hola {{name}} 👋🏻\nRecibiste un aviso automático de NotifyCar 🚗💚.\n\nUna persona que se encontraba cerca de tu vehículo:\n🚗 {{marca}} - {{modelo}} {{electrico}}\n\nℹ️ Este aviso fue enviado a través de NotifyCar usando únicamente la placa de tu vehículo.\n\n📞 Emergencias: {{NUM_EMERGENCIAS}}`;
        }

        // 4. Reemplazo de etiquetas (Insertamos el mensaje de primero para que sus etiquetas internas se reemplacen luego)
        const finalMessage = wrapper
            .replace(/{{mensaje}}/g, content)
            .replace(/{{raw_message}}/g, content)
            .replace(/{{tipo}}/g, vehicleTypeLabel)
            .replace(/{{placa}}/g, vehicle.plate.toUpperCase())
            .replace(/{{plate}}/g, vehicle.plate.toUpperCase())
            .replace(/{{name}}/g, targetName)
            .replace(/{{marca}}/g, vehicle.brand || '')
            .replace(/{{brand}}/g, vehicle.brand || '')
            .replace(/{{modelo}}/g, vehicle.model || '')
            .replace(/{{model}}/g, vehicle.model || '')
            .replace(/{{icono}}/g, vehicleIcon)
            .replace(/{{electrico}}/g, electricTag ? ` ${electricTag}` : '')
            .replace(/{{policia}}/g, emergency.police)
            .replace(/{{NUM_POLICIA}}/g, emergency.police)
            .replace(/{{transito}}/g, emergency.transit)
            .replace(/{{NUM_TRANSITO}}/g, emergency.transit)
            .replace(/{{emergencia}}/g, emergency.general)
            .replace(/{{NUM_EMERGENCIAS}}/g, emergency.general)
            .replace(/{{role}}/g, recipientRole === "OWNER" ? "Propietario" : recipientRole === "DRIVER" ? "Conductor" : "Usuario");

        // Create the notification in DB
        const notification = await db.notification.create({
            data: {
                vehicleId,
                content: finalMessage,
                type: type || "APP",
                status: "SENT",
                // @ts-ignore
                organizationId: (templateId ? (await db.notificationTemplate.findUnique({ where: { id: templateId }, select: { organizationId: true } }))?.organizationId : null)
            }
        })

        // Fetch webhook from DB settings first, then env
        let webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
        const systemSettings = await db.systemSetting.findUnique({ where: { id: "default" } });
        if (systemSettings?.webhookUrl) {
            webhookUrl = systemSettings.webhookUrl;
        }

        if (targetPhone) {
            try {
                // Limpiar: dejar solo dígitos
                let fullPhone = targetPhone.replace(/\D/g, '');

                // Si tiene 10 dígitos (Colombia) y no empieza por 57, se lo ponemos
                if (fullPhone.length === 10 && !fullPhone.startsWith('57')) {
                    fullPhone = `57${fullPhone}`;
                }

                // --- ENVÍO POR EVOLUTION API (OPCIONAL) ---
                const evolutionUrl = process.env.EVOLUTION_API_URL;
                const evolutionKey = process.env.EVOLUTION_API_KEY;
                const evolutionInstance = process.env.EVOLUTION_INSTANCE || "Notifycar";

                if (evolutionUrl && evolutionKey && evolutionKey !== "TU_API_KEY_AQUÍ") {
                    console.log("🚀 Enviando vía Evolution API...");
                    fetch(`${evolutionUrl}/message/sendText/${evolutionInstance}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'apikey': evolutionKey
                        },
                        body: JSON.stringify({
                            number: fullPhone,
                            options: {
                                delay: 1200,
                                presence: "composing",
                                linkPreview: true
                            },
                            textMessage: {
                                text: finalMessage
                            }
                        })
                    }).then(r => console.log("📱 Evolution API Response Status:", r.status))
                        .catch(err => console.error("❌ Evolution API Error:", err));
                }

                // --- ENVÍO POR WEBHOOK N8N (EXISTENTE) ---
                if (webhookUrl) {
                    console.log("🚀 Enviando a n8n Webhook...");
                    fetch(webhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            notificationId: notification.id,
                            plate: vehicle.plate,
                            ownerName: targetName,
                            phoneNumber: fullPhone,
                            raw_message: content,
                            message: finalMessage,
                            content: finalMessage,
                            timestamp: notification.createdAt
                        })
                    }).then(r => console.log("📡 Webhook Response Status:", r.status))
                        .catch(err => console.error("❌ Webhook fetch error:", err));
                }
            } catch (err) {
                console.error("Error preparing notification data:", err);
            }
        } else {
            console.log("⚠️ Notification skipped. Phone:", targetPhone);
        }

        return NextResponse.json(notification)
    } catch (error) {
        console.error("[NOTIFICATIONS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
