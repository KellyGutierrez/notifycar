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
        const { vehicleId, content, type, templateId, recipientRole } = body

        if (!vehicleId || !content) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        // Check for cooldown (10 minutes)
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
        });

        if (!vehicle) {
            return new NextResponse("Vehículo no encontrado", { status: 404 });
        }

        console.log("🔍 [DEBUG] Recipient Role:", recipientRole);
        console.log("🔍 [DEBUG] Vehicle Contacts:", {
            ownerName: vehicle.ownerName,
            ownerPhone: vehicle.ownerPhone,
            driverName: vehicle.driverName,
            driverPhone: vehicle.driverPhone
        });

        // Determine target contact and name based on role
        let targetName = vehicle.user.name || "Usuario"
        let targetPhone = `${vehicle.user.phonePrefix || ""}${vehicle.user.phoneNumber || ""}`

        if (recipientRole === "OWNER" && vehicle.ownerPhone) {
            targetPhone = vehicle.ownerPhone
            targetName = vehicle.ownerName || targetName
            console.log("✅ Target: OWNER", targetPhone);
        } else if (recipientRole === "DRIVER" && vehicle.driverPhone) {
            targetPhone = vehicle.driverPhone
            targetName = vehicle.driverName || targetName
            console.log("✅ Target: DRIVER", targetPhone);
        } else {
            console.log("ℹ️ Falling back to User phone:", targetPhone);
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

        // 1. Intentar obtener wrapper de la organización vinculada a la plantilla
        let wrapper = "";
        if (templateId) {
            const template = await db.notificationTemplate.findUnique({
                where: { id: templateId },
                include: { organization: true }
            });
            if (template?.organization?.messageWrapper) {
                wrapper = template.organization.messageWrapper;
            }
        }

        // 2. Si no hay wrapper de org, buscar el global en settings
        const settings = await db.systemSetting.findUnique({ where: { id: "default" } });
        if (!wrapper && settings?.messageWrapper) {
            wrapper = settings.messageWrapper;
        }

        // 3. Fallback al diseño por defecto si todo lo anterior falla
        if (!wrapper) {
            wrapper = `🚗 *NotifyCar*\nAlguien cerca de tu vehículo quiso avisarte lo siguiente:\n“{{plate}} - {{raw_message}}”\n\nℹ️ Este aviso fue enviado a través de NotifyCar usando únicamente la placa de tu vehículo.\n\n📞 Emergencias: {{NUM_EMERGENCIAS}}`;
        }

        // 4. Reemplazo de etiquetas
        const finalMessage = wrapper
            .replace(/{{tipo}}/g, vehicleTypeLabel)
            .replace(/{{placa}}/g, vehicle.plate.toUpperCase())
            .replace(/{{plate}}/g, vehicle.plate.toUpperCase())
            .replace(/{{name}}/g, targetName)
            .replace(/{{mensaje}}/g, content)
            .replace(/{{raw_message}}/g, content)
            .replace(/{{icono}}/g, vehicleIcon)
            .replace(/{{electrico}}/g, electricTag ? `\n${electricTag}\n` : '')
            .replace(/{{policia}}/g, emergency.police)
            .replace(/{{NUM_POLICIA}}/g, emergency.police)
            .replace(/{{transito}}/g, emergency.transit)
            .replace(/{{NUM_TRANSITO}}/g, emergency.transit)
            .replace(/{{emergencia}}/g, emergency.general)
            .replace(/{{NUM_EMERGENCIAS}}/g, emergency.general);

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

        if (webhookUrl && targetPhone) {
            try {
                const fullPhone = targetPhone.replace(/\+/g, '').replace(/\s/g, '');

                console.log("🚀 Enviando WhatsApp a:", fullPhone);
                console.log("📦 Payload:", {
                    notificationId: notification.id,
                    plate: vehicle.plate,
                    ownerName: targetName,
                    phoneNumber: fullPhone,
                    raw_message: content
                });

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
            } catch (err) {
                console.error("Error preparing webhook data:", err);
            }
        } else {
            console.log("⚠️ Webhook skipped. URL:", !!webhookUrl, "Phone:", targetPhone);
        }

        return NextResponse.json(notification)
    } catch (error) {
        console.error("[NOTIFICATIONS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
