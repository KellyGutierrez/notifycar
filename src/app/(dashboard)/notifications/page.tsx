import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Bell, CheckCheck, Clock, AlertTriangle } from "lucide-react"
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

    const formatTime = (date: Date) => {
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const mins = Math.floor(diff / 60000)
        if (mins < 60) return `Hace ${mins} min`
        const hours = Math.floor(mins / 60)
        if (hours < 24) return `Hace ${hours} horas`
        return date.toLocaleDateString()
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
                    notifications.map((notif) => (
                        <div key={notif.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-4 hover:bg-white/10 transition group">
                            <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${notif.type === 'alert' || notif.content.toLowerCase().includes('emergencia') || notif.content.toLowerCase().includes('peligro') ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                                }`}>
                                {(notif.type === 'alert' || notif.content.toLowerCase().includes('emergencia')) ? <AlertTriangle className="h-6 w-6" /> : <Bell className="h-6 w-6" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors">
                                            {notif.vehicle.plate} - {notif.vehicle.brand}
                                        </h3>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase font-bold mt-0.5">
                                            Status: {notif.status}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Clock className="h-3 w-3" />
                                        {formatTime(new Date(notif.createdAt))}
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm mt-2">{notif.content}</p>
                            </div>
                        </div>
                    ))
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
