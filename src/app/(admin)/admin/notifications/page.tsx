import { db } from "@/lib/db"
import { Bell, Clock, CheckCircle2, XCircle, Send, Car } from "lucide-react"
import { cn } from "@/lib/utils"

async function getNotifications() {
    return await db.notification.findMany({
        include: {
            vehicle: {
                select: { plate: true, brand: true, model: true }
            }
        },
        orderBy: { createdAt: "desc" },
        take: 50
    })
}

export default async function AdminNotificationsPage() {
    const notifications = await getNotifications()

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-white">Historial de Alertas</h1>
                <p className="text-gray-400">Registro detallado de notificaciones enviadas a usuarios.</p>
            </div>

            {/* Timeline/Feed */}
            <div className="space-y-4">
                {notifications.map((notif) => (
                    <div
                        key={notif.id}
                        className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all backdrop-blur-sm"
                    >
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                            {/* Status Icon */}
                            <div className={cn(
                                "h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border shadow-lg",
                                notif.status === "SENT"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : "bg-red-500/10 text-red-400 border-red-500/20"
                            )}>
                                {notif.status === "SENT" ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                            </div>

                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                    <span className={cn(
                                        notif.status === "SENT" ? "text-emerald-400" : "text-red-400"
                                    )}>
                                        {notif.status === "SENT" ? "Enviado Exitosamente" : "Error en Envío"}
                                    </span>
                                    <span className="text-white/20 px-1">•</span>
                                    <span className="text-gray-500 flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {new Date(notif.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-gray-200 font-medium">{notif.content}</p>
                                <div className="flex items-center gap-3 pt-1">
                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20 uppercase">
                                        <Car className="h-3 w-3" />
                                        {notif.vehicle.plate}
                                    </div>
                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 text-gray-400 text-[10px] font-bold uppercase">
                                        <Send className="h-3 w-3" />
                                        {notif.type}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {notifications.length === 0 && (
                    <div className="py-20 text-center space-y-4 bg-white/2 border border-white/10 border-dashed rounded-3xl">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                            <Bell className="h-8 w-8 text-gray-600" />
                        </div>
                        <p className="text-gray-500 font-medium">No se registra actividad de notificaciones.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
