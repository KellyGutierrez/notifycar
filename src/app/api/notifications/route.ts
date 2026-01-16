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
        const { vehicleId, content, type } = body

        if (!vehicleId || !content) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        // Check for cooldown (10 minutes)
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

        // Create the notification in DB
        const notification = await db.notification.create({
            data: {
                vehicleId,
                content,
                type: type || "APP",
                status: "SENT"
            },
            include: {
                vehicle: {
                    include: {
                        user: {
                            select: {
                                phonePrefix: true,
                                phoneNumber: true,
                                name: true
                            }
                        }
                    }
                }
            }
        })

        // Send to n8n Webhook
        const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
        if (webhookUrl) {
            try {
                const fullPhone = `${notification.vehicle.user.phonePrefix}${notification.vehicle.user.phoneNumber}`.replace(/\+/g, '');

                // Fetch call to n8n (async)
                fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        notificationId: notification.id,
                        plate: notification.vehicle.plate,
                        ownerName: notification.vehicle.user.name,
                        phoneNumber: fullPhone,
                        message: notification.content,
                        timestamp: notification.createdAt
                    })
                }).catch(err => console.error("Webhook fetch error:", err));
            } catch (err) {
                console.error("Error preparing webhook data:", err);
            }
        }

        return NextResponse.json(notification)
    } catch (error) {
        console.error("[NOTIFICATIONS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
