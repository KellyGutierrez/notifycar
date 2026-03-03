import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Bell, CheckCheck, Clock, AlertTriangle, MessageSquare } from "lucide-react"
import { db } from "@/lib/db"

export default async function NotificationsPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/account/signin")
    }

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

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }

    // Extracts only the essential user message from the full notification template
    const extractMessage = (content: string): string => {
        const msgMatch = content.match(/Te dej[oó] este mensaje[:\s]*["\u201c]?([^"\u201d\n]+)["\u201d]?/i)
        if (msgMatch) return msgMatch[1].trim().replace(/["\u201c\u201d]/g, '')
        const firstLine = content.split(/\n|\u2015|\u2500/)[0].trim()
        return firstLine.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim().slice(0, 120)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Notificaciones</h1>
                    <p className="text-gray-400">Historial de alertas y mensajes</p>
                </div>
                {notifications.length > 0 && (
                    <button className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1">
                        <CheckCheck className="h-4 w-4" /> Marcar todas como leídas
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map((notif) => {
                        const isAlert = notif.type === 'alert' || notif.content.toLowerCase().includes('emergencia') || notif.content.toLowerCase().includes('peligro')
                        const summary = extractMessage(notif.content)
                        return (
                            <div key={notif.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-3 hover:bg-white/10 transition group">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isAlert ? 'bg-red-500/20 text-red-400' : 'bg-green-500/15 text-green-400'}`}>
                                    {isAlert ? <AlertTriangle className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="font-semibold text-white text-sm group-hover:text-green-400 transition-colors truncate">
                                            {notif.vehicle.plate} · {notif.vehicle.brand}
                                        </h3>
                                        <span className="text-[11px] text-gray-500 shrink-0 flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {formatDate(new Date(notif.createdAt))}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                                        {summary}
                                    </p>
                                    <span className={`inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${notif.status === 'SENT' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                                        {notif.status === 'SENT' ? 'Enviado' : notif.status}
                                    </span>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-2xl text-center">
                        <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Bell className="h-8 w-8 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">No tienes notificaciones</h3>
                        <p className="text-gray-400 mt-1">Las alertas sobre tus vehículos aparecerán aquí.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
