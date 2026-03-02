import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { db } from "@/lib/db"
import { sendWhatsAppMessage } from "@/lib/evolution"

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
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

        let vehicle: any;

        if (vehicleId === "virtual-test-id") {
            vehicle = {
                id: "virtual-test-id",
                plate: "TEST-999",
                brand: "MASTER TEST",
                model: "BYPASS",
                type: "CAR",
                isElectric: true,
                user: {
                    name: "Rowell (Tester)",
                    phonePrefix: "+57",
                    phoneNumber: "3004019274",
                    country: "COLOMBIA"
                }
            }
        } else {
            vehicle = await db.vehicle.findUnique({
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
        }

        if (!vehicle) {
            return new NextResponse("Vehículo no encontrado", { status: 404 });
        }

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

        if (lastNotification && vehicle.plate.toUpperCase() !== "TEST-999") {
            const timeLeft = Math.ceil((lastNotification.createdAt.getTime() + 10 * 60 * 1000 - Date.now()) / 1000 / 60)
            return new NextResponse(`Este vehículo ya recibió un mensaje recientemente. Por favor, espera ${timeLeft} minuto(s) antes de enviar otro.`, { status: 429 })
        }

        let targetName = vehicle.user?.name || "Usuario"
        let targetPhone = `${vehicle.user?.phonePrefix || ""}${vehicle.user?.phoneNumber || ""}`

        if (!recipientRole && vehicle.organizationId) {
            if (vehicle.driverPhone) {
                recipientRole = "DRIVER";
            } else if (vehicle.ownerPhone) {
                recipientRole = "OWNER";
            }
        }

        if (recipientRole === "OWNER" && vehicle.ownerPhone) {
            targetPhone = vehicle.ownerPhone
            targetName = vehicle.ownerName || targetName || "Propietario"
        } else if (recipientRole === "DRIVER" && vehicle.driverPhone) {
            targetPhone = vehicle.driverPhone
            targetName = vehicle.driverName || targetName || "Conductor"
        }

        let emergency = { police: "123", transit: "123", general: "123" };
        const userCountry = (vehicle.user?.country || "").trim().toUpperCase();

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
            } else if (userCountry === "CO" || userCountry === "COLOMBIA") {
                emergency = { police: "123", transit: "127", general: "123" };
            } else if (userCountry === "MX" || userCountry === "MEXICO" || userCountry === "MÉXICO") {
                emergency = { police: "911", transit: "911", general: "911" };
            }
        }

        const vehicleIcon = vehicle.type === 'MOTORCYCLE' ? '🏍️' : '🚘';
        const vehicleTypeLabel = vehicle.type === 'MOTORCYCLE' ? 'MOTOCICLETA' : 'VEHÍCULO';
        const electricTag = vehicle.isElectric ? '⚡ *VEHÍCULO ELÉCTRICO*' : '';

        let wrapper = "";
        if (vehicle.organizationId) {
            const org = await db.organization.findUnique({
                where: { id: vehicle.organizationId },
                select: { messageWrapper: true }
            });
            if (org?.messageWrapper) {
                wrapper = org.messageWrapper;
            }
        }

        if (!wrapper) {
            const settings = await db.systemSetting.findUnique({ where: { id: "default" } });
            if (settings?.messageWrapper) {
                wrapper = settings.messageWrapper;
            }
        }

        if (!wrapper) {
            wrapper = `Hola {{name}} 👋🏻\nRecibiste un aviso automático de NotifyCar 🚗💚.\n\nUna persona que se encontraba cerca de tu vehículo:\n🚗 {{marca}} - {{modelo}} {{electrico}}\n\nℹ️ Este aviso fue enviado a través de NotifyCar usando únicamente la placa de tu vehículo.\n\n📞 Emergencias: {{NUM_EMERGENCIAS}}`;
        }

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

        let notification: any;
        if (vehicleId === "virtual-test-id") {
            notification = {
                id: "virtual-notif-id-" + Date.now(),
                vehicleId: "virtual-test-id",
                content: finalMessage,
                type: type || "APP",
                status: "SENT",
                createdAt: new Date()
            };
        } else {
            notification = await db.notification.create({
                data: {
                    vehicleId,
                    content: finalMessage,
                    type: type || "APP",
                    status: "SENT",
                    // @ts-ignore
                    organizationId: (templateId ? (await db.notificationTemplate.findUnique({ where: { id: templateId }, select: { organizationId: true } }))?.organizationId : null)
                }
            })
        }

        let webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
        const systemSettings = await db.systemSetting.findUnique({ where: { id: "default" } });
        if (systemSettings?.webhookUrl) {
            webhookUrl = systemSettings.webhookUrl;
        }

        if (targetPhone) {
            try {
                let fullPhone = targetPhone.replace(/\D/g, '');
                if (fullPhone.length === 10 && !fullPhone.startsWith('57')) {
                    fullPhone = `57${fullPhone}`;
                }

                // WhatsApp via central utility
                await sendWhatsAppMessage(fullPhone, finalMessage);

                // Webhook
                if (webhookUrl) {
                    fetch(webhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            notificationId: notification.id,
                            plate: vehicle.plate,
                            ownerName: targetName,
                            phoneNumber: fullPhone,
                            message: finalMessage,
                            timestamp: notification.createdAt
                        })
                    }).catch(err => console.error("❌ Webhook error:", err));
                }
            } catch (err) {
                console.error("Error preparing notification:", err);
            }
        }

        return NextResponse.json(notification)
    } catch (error) {
        console.error("[NOTIFICATIONS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
